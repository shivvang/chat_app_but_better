import User from "../models/user.model.js";

export const SearchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    // Input validation
    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim() === ""
    ) {
      return res.status(400).json({
        error: "Search term is required and must be a non-empty string",
      });
    }

    // Sanitize and validate search term
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    // Limit input length to mitigate ReDoS risk
    if (sanitizedSearchTerm.length > 100) {
      return res.status(400).json({ error: "Search term is too long" });
    }

    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Query the database
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        { $or: [{ userName: regex }, { email: regex }] }, // Match by username or email
      ],
    });

    // Return results or empty array if no matches
    return res
      .status(200)
      .json({ contacts: contacts.length > 0 ? contacts : [] });
  } catch (error) {
    console.error("Error during contact search:", error);
    res
      .status(500)
      .json({ error: "Internal server error during contact search" });
  }
};
