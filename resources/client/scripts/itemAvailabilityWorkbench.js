debugger;
try
{
  var _item = mywindow.findChild("_item");

  var _tab = mywindow.findChild("_tab");
  var _bomTab = mywindow.findChild("costed");
  var _contractbomTab = toolbox.loadUi("contractCostedBOM", mywindow);
  var _tabindex = toolbox.tabTabIndex(_tab, _bomTab) + 1;
  toolbox.tabInsertTab(_tab, _tabindex, _contractbomTab, qsTr("Contract Bill of Materials"));

  var _site = _contractbomTab.findChild("_site");
  var _port = _contractbomTab.findChild("_port");
  var _contractbom = _contractbomTab.findChild("_contractbom");

  _port.populate("SELECT port_id, (port_number || '-' || port_descrip) "
               + "FROM cgms.port "
               + "ORDER BY port_number;");

  _contractbom.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "site");
  _contractbom.addColumn(qsTr("Vendor"),        -1, Qt.AlignLeft,  true, "vendor");
  _contractbom.addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item");
  _contractbom.addColumn(qsTr("Component"),     -1, Qt.AlignLeft,  true, "component_item");
  _contractbom.addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "indx");
  _contractbom.addColumn(qsTr("Index Base"),    -1, Qt.AlignLeft,  true, "indx_base");
  _contractbom.addColumn(qsTr("Pct. Markup"),   -1, Qt.AlignRigt,  true, "markup");
  _contractbom.addColumn(qsTr("Cost"),          -1, Qt.AlignRight, true, "cost");

  _item.newId.connect(fillList);
  _site.newId.connect(fillList);
  _port.newId.connect(fillList);
}
catch (e)
{
  QMessageBox.critical(mywindow, "itemAvailabilityWorkbench",
                       "itemAvailabilityWorkbench.js exception: " + e);
}

function fillList()
{
  try
  {
    if (!_item.isValid() || !site.isValid() || !port.isValid())
      return;

    var params = new Object();
    params.item_id = _item.id();
    params.warehous_id = _site.id();
    params.port_id = _port.id();

    _contractbom.clear();
    var data = toolbox.executeDbQuery("contract", "costedbom", params);
    if (data.first())
      _contractbom.populate(data, true);
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemAvailabilityWorkbench",
                         qsTr("fillList exception: ") + e);
  }
}

