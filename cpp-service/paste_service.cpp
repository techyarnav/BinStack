#include <crow.h>
#include <fstream>
#include <filesystem>
#include <iostream>

int main() {
    crow::SimpleApp app;

    std::filesystem::create_directories("../../pastes");

    CROW_ROUTE(app, "/save").methods("POST"_method)
    ([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, R"({"error":"Invalid JSON"})");
        }
        std::string id = body["id"].s();
        std::string content = body["content"].s();

        // Security: Only allows alphanumeric IDs of length 8
        if (id.length() != 8 || id.find_first_not_of("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") != std::string::npos) {
            return crow::response(400, R"({"error":"Invalid ID"})");
        }

        std::string filename = "../../pastes/" + id + ".txt";
        std::ofstream ofs(filename);
        if (!ofs) {
            return crow::response(500, R"({"error":"File write failed"})");
        }
        ofs << content;
        ofs.close();

        return crow::response(R"({"status":"saved"})");
    });

    std::cout << "Crow microservice running on http://localhost:18080" << std::endl;
    app.port(18080).multithreaded().run();
}
