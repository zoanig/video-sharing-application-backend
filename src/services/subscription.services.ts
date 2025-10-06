import mongoose from "mongoose";
import { Subscription } from "../models/subcription.model";
import { payload } from "../types";
import { ApiError } from "../utils/ApiError";

export const subscribe = async (id: mongoose.Types.ObjectId, user: payload) => {
  try {
    await Subscription.findOne({ channel: id, subscriber: user._id }).orFail();
    const result = await Subscription.create({
      channel: id,
      subscriber: user._id,
    });
    return { message: "Channel subscribed successfully" };
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(400, "Channel not found");
    }
    throw new ApiError(500, "Something went wrong while subscribing");
  }
};

export const unSubscribe = async (
  id: mongoose.Types.ObjectId,
  user: payload
) => {
  try {
    await Subscription.findOneAndDelete({
      channel: id,
      subscriber: user._id,
    }).orFail();
    return { message: "Channel unsubscribed successfully" };
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(400, "Channel not found");
    }
    throw new ApiError(500, "Something went wrong while unsubscribing");
  }
};

export const getAllSubscribers = async (user: payload) => {
  try {
    const subscribers = await Subscription.find({
      channel: user._id,
    }).orFail();
    return subscribers;
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(400, "Subscribers not found");
    }
    throw new ApiError(500, "Something went wrong while getting subscribers");
  }
};
