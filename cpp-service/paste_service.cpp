#include "crow.h"
#include <fstream>
#include <iostream>
#include <string>
#include <filesystem>

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/save").methods("POST"_method)
    ([](const crow::request& req) {
        crow::response res;
        
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        
        try {
            auto json = crow::json::load(req.body);
            if (!json || !json.has("id") || !json.has("content")) {
                res.code = 400;
                res.body = "Missing id or content";
                return res;
            }

            std::string id = json["id"].s();
            std::string content = json["content"].s();
            
            std::filesystem::create_directories("pastes");
            
            std::string filename = "pastes/" + id + ".txt";
            std::ofstream file(filename);
            if (!file.is_open()) {
                res.code = 500;
                res.body = "Failed to create file";
                return res;
            }
            
            file << content;
            file.close();
            
            res.code = 200;
            res.body = "File saved successfully";
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = "Internal error: " + std::string(e.what());
            return res;
        }
    });

    CROW_ROUTE(app, "/get/<string>")
    ([](const std::string& id) {
        crow::response res;
        
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        
        try {
            std::string filename = "pastes/" + id + ".txt";
            
            if (!std::filesystem::exists(filename)) {
                res.code = 404;
                res.body = "Paste not found";
                return res;
            }
            
            std::ifstream file(filename);
            if (!file.is_open()) {
                res.code = 500;
                res.body = "Failed to read file";
                return res;
            }
            
            std::string content((std::istreambuf_iterator<char>(file)),
                               std::istreambuf_iterator<char>());
            file.close();
            
            crow::json::wvalue response;
            response["content"] = content;
            response["id"] = id;
            
            res.code = 200;
            res.body = response.dump();
            res.add_header("Content-Type", "application/json");
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = "Internal error: " + std::string(e.what());
            return res;
        }
    });

    CROW_ROUTE(app, "/save").methods("OPTIONS"_method)
    ([](const crow::request& req) {
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        res.code = 200;
        return res;
    });

    CROW_ROUTE(app, "/health")
    ([]() {
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.code = 200;
        res.body = "C++ Crow service is running";
        return res;
    });

    std::cout << "C++ Crow service starting on port 18080..." << std::endl;
    app.port(18080).multithreaded().run();
    
    return 0;
}
