# Use official GCC image
FROM gcc:latest

# Set working directory
WORKDIR /app

# Install cmake and ASIO library
RUN apt-get update && apt-get install -y cmake libasio-dev

# Copy source files
COPY . .

# Clean build directory if exists, then build
RUN rm -rf build && mkdir build && cd build && cmake .. && make

# Expose port
EXPOSE 18080

# Run the service
CMD ["./build/paste_service"]
