const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const profilesRouter = express.Router();
const { isValidDate } = require("../auth/utils.js");

// GET all user profiles
profilesRouter.get("/", async (req, res) => {
  try {
    const profiles = await prisma.profiles.findMany();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).send(error.message);
  }
});

// GET a user's profile by user_id
profilesRouter.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Made it to 21");
  try {
    const profile = await prisma.profiles.findFirst({
      where: { user_id: userId },
    });
    if (profile) {
      res.json(profile);
    } else {
      res.status(404).send("Profile not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// POST a new user profile
profilesRouter.post("/", async (req, res) => {
  try {
    const {
      user_id,
      name,
      birthdate,
      gender,
      orientation,
      height_ft,
      height_in,
      body_type,
      ethnicity,
      smokes,
      drinks,
      profession,
      current_location,
      hometown,
      looking_for,
      picture_url,
    } = req.body;

    // Validate the birthdate format
    if (!isValidDate(birthdate)) {
      return res.status(400).send("Invalid birthdate format. Use YYYY-MM-DD.");
    }

    // Convert birthdate to JavaScript Date object
    const formattedBirthdate = new Date(birthdate);

    const smokesBool = smokes === "yes";
    const drinksBool = drinks === "yes";

    // Create a new profile
    const newProfile = await prisma.profiles.create({
      data: {
        user_id, // Directly use the user_id from the request
        name,
        birthdate: formattedBirthdate,
        gender,
        orientation,
        height_ft,
        height_in,
        body_type,
        ethnicity,
        smokes: smokesBool,
        drinks: drinksBool,
        profession,
        current_location,
        hometown,
        looking_for,
        picture_url,
      },
    });

    // Send the created profile as a response
    res.status(201).json(newProfile);
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).send(error.message);
  }
});

// PUT to update a user's profile by user_id
profilesRouter.put("/:profileId", async (req, res) => {
  const { profileId } = req.params; // Get the profileId from the route params
  const { name, gender } = req.body;
  console.log(`Received PUT request for profileId: ${profileId}`);
  console.log(`Updated name: ${name}, gender: ${gender}`);

  try {
    // Ensure that the profile exists
    const existingProfile = await prisma.profiles.findUnique({
      where: { profile_id: profileId }, // Use the dynamically retrieved profileId
    });

    if (!existingProfile) {
      console.log("Profile not found");
      return res.status(420).send("Profile not found");
    }

    // Update the profile data
    const updatedProfile = await prisma.profiles.update({
      where: { profile_id: profileId }, // Use the dynamically retrieved profileId
      data: {
        name, // Update the name field
        gender, // Update the gender field
      },
    });

    console.log("Update successful:", updatedProfile);

    res.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send(error.message);
  }
});

// DELETE a user's profile by user_id
profilesRouter.delete("/:userId", async (req, res) => {
  try {
    await prisma.profiles.delete({
      where: { user_id: userId },
    });
    res.status(204).send("Profile deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = profilesRouter;
