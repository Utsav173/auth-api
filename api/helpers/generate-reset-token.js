// api/helpers/generate-reset-token.js

const crypto = require('crypto');

module.exports = {
  friendlyName: 'Generate reset token',
  description: 'Generate a random reset token for a user',
  inputs: {
    userId: {
      type: 'number',
      required: true,
      description: 'The ID of the user to generate a reset token for'
    }
  },
  exits: {
    success: {
      outputFriendlyName: 'Reset token',
      outputDescription: 'The generated reset token'
    }
  },
  fn: async function(inputs, exits) {
    try {
      const resetToken = crypto.randomBytes(20).toString('hex');
      await User.updateOne({ id: inputs.userId }).set({
        resetToken: resetToken
      });
      return exits.success(resetToken);
    } catch (error) {
      return exits.error(error);
    }
  }
};
