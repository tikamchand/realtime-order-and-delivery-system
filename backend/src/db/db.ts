import mongoose, { ConnectOptions } from "mongoose";

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const MONGODB_URI = process.env.MONGODB_URI;

class DatabaseConnection {
  private retryCount: number;
  private isConnected: boolean;

  constructor() {
    this.retryCount = 0;
    this.isConnected = false;

    mongoose.set("strictQuery", false);
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected");
      this.isConnected = true;
    });
    mongoose.connection.on("error", () => {
      console.log("MongoDB error");
      this.isConnected = false;
    });
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      this.handleDisconnection();
    });

    process.on("SIGTERM", this.handleAppTermination.bind(this));
  }

  async connect() {
    try {
      if (!MONGODB_URI) {
        throw new Error(`MONGODB_URI is not defined `);
      }
      console.log(MONGODB_URI);
      const connectionOptions: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions;

      if (process.env.NODE_ENV === "development") {
        mongoose.set("debug", true);
      }

      await mongoose.connect(MONGODB_URI, connectionOptions);
      this.retryCount = 0;
    } catch (error) {
      console.error("MongoDB connection error:", error);
      this.handleConnectionError();
    }
  }

  async handleConnectionError() {
    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      this.connect();
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }

  async handleDisconnection() {
    if (!this.isConnected) {
      console.log("Attempting to reconnect to MongoDb...");
      await this.connect();
    }
  }

  async handleAppTermination() {
    try {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
      process.exit(0);
    } catch (error) {
      console.error("Error during MongoDB disconnection:", error);
      process.exit(1);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }
}

const dbConnection = new DatabaseConnection();

export default dbConnection.connect.bind(dbConnection);
export const getDBStatus = dbConnection.getConnectionStatus.bind(dbConnection);
