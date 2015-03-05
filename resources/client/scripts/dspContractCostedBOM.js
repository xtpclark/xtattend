debugger;

include("storedProcErrorLookup");
include("xtattendErrors");

try
{
  mywindow.setWindowTitle(qsTr("Contract Costed Bill of Materials"));
  mywindow.setListLabel(qsTr("Costed Bill of Materials"));
  mywindow.setReportName("");
  mywindow.setMetaSQLOptions("contract", "costedbom");
  mywindow.setParameterWidgetVisible(true);
  mywindow.setNewVisible(false);

  mywindow.parameterWidget().append(qsTr("Item"), "item_id", ParameterWidget.Item, true, true);
  mywindow.parameterWidget().append(qsTr("Site"), "warehous_id", ParameterWidget.Site, true, true);
  mywindow.parameterWidget().appendComboBox(qsTr("Port"), "port_id",
                   "SELECT port_id, (port_number || '-' || port_descrip) "
                 + "FROM xtattend.port "
                 + "ORDER BY port_number;", true, true);
  mywindow.parameterWidget().applyDefaultFilterSet();

  mywindow.list().addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "site");
  mywindow.list().addColumn(qsTr("Vendor"),        -1, Qt.AlignLeft,  true, "vendor");
  mywindow.list().addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item");
  mywindow.list().addColumn(qsTr("Component"),     -1, Qt.AlignLeft,  true, "component_item");
  mywindow.list().addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "indx");
  mywindow.list().addColumn(qsTr("Index Base"),    -1, Qt.AlignLeft,  true, "indx_base");
  mywindow.list().addColumn(qsTr("Pct. Markup"),   -1, Qt.AlignRigt,  true, "markup");
  mywindow.list().addColumn(qsTr("Cost"),          -1, Qt.AlignRight, true, "cost");
}
catch (e)
{
  QMessageBox.critical(mywindow, "dspContractCostedBOM",
                       "dspContractCostedBOM.js exception: " + e);
}

function setParams(params)
{
  try
  {
//    params.item_id = _item.id();
    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "dspContractCostedBOM",
                         "dspContractCostedBOM.js exception: " + e);

    return false;
  }
}

