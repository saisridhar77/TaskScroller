import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  importance: { type: Number, default: 5 },
  effort: { type: Number, default: 5 },
  difficulty: { type: Number, default: 5 },
  consequences: { type: Number, default: 5 },
  estimated_days: { type: Number, default: 1 },
  status: {type: String,enum: ['pending', 'completed', 'missed'],default: 'pending'},
  completed_at: { type: Date },
  remaining_days: { type: Number },
  last_scheduled_at: { type: Date },
},{ timestamps: true });

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;
