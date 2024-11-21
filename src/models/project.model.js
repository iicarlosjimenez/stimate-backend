const mongoose = require("mongoose");
const modelName = "projects";
const schema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  slug: {
    type: String,
    required: true,
  },
  name_project: {
    type: String,
    required: true,
  },
  status_project: {
    type: String,
    required: true,
  },
  type_project: {
    type: String,
    enum: ["template", "normal"],
    required: true,
  },
  team_project: [
    {
      team: {
        type: String,
        required: true,
      },
      hourly_rate: {
        type: Number,
      },
      work_hours_per_day: {
         type: Number
      }
   }],
   features_project: [{
      feature: {
        type: String,
        required: true,
      },
      team_features: [
        {
          team: {
            type: String,
            required: true,
          },
          time: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
  operating_expenses: [
    {
      cost_name: {
        type: String,
      },
      total_per_month: {
        type: String,
      },
    },
  ],
  associated_costs: [
    {
      cost_name: {
        type: String,
        required: true,
      },
      price_unity: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      type_recurring: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  sale_comission: {
    type: Number,
    default: 0,
  },
  profit: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  notes: {
    type: String,
  },
});

module.exports = mongoose.model(modelName, schema);
