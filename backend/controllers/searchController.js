export const searchUsers = (req, res) => {
    const { query } = req.query;

    // Simulate search results
    const results = [
        { id: 1, name: "Alice Example" },
        { id: 2, name: "Bob Example" },
        { id: 3, name: "Charlie Example" },
    ].filter((u) => u.name.toLowerCase().includes((query || "").toLowerCase()));

    res.json(results);
};