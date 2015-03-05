var xtattendErrors = new Object;

xtattendErrors.deleteContract = new Object;
xtattendErrors.deleteContract[-1] = qsTr("Cannot delete Contract");
xtattendErrors.deletePort = new Object;
xtattendErrors.deletePort[-1] = qsTr("Cannot delete Port, used by Contract");
xtattendErrors.deletePort[-2] = qsTr("Cannot delete Port, used by Sales Order");
xtattendErrors.deletePort[-3] = qsTr("Cannot delete Port, used by Purchase Order");
xtattendErrors.deleteShipzone = new Object;
xtattendErrors.deleteShipzone[-1] = qsTr("Cannot delete Shipzone, used by Port");
