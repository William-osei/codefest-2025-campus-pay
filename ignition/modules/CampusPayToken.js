const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CampusPayTokenModule", (m) => {
  const campusPayToken = m.contract("CampusPayToken");

  return { campusPayToken };
});
