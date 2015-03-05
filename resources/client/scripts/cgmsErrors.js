var cgmsErrors = new Object;

cgmsErrors.deleteContract = new Object;
cgmsErrors.deleteContract[-1] = qsTr("Cannot delete Contract");
cgmsErrors.deletePort = new Object;
cgmsErrors.deletePort[-1] = qsTr("Cannot delete Port, used by Contract");
cgmsErrors.deletePort[-2] = qsTr("Cannot delete Port, used by Sales Order");
cgmsErrors.deletePort[-3] = qsTr("Cannot delete Port, used by Purchase Order");
cgmsErrors.deleteShipzone = new Object;
cgmsErrors.deleteShipzone[-1] = qsTr("Cannot delete Shipzone, used by Port");
