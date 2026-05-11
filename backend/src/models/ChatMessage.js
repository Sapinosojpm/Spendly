import mongoose from 'mongoose';

const chatMessageSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ['user', 'ai'],
    },
    context: {
      income: Number,
      expenses: Number,
      budgetRemaining: Number,
      paydayInfo: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
