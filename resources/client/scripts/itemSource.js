debugger;
try
{
  var _item = mywindow.findChild("_item");
  var _vendor = mywindow.findChild("_vendor");

  var _tab = mywindow.findChild("_tab");
  var _pricesTab = mywindow.findChild("_pricesTab");
  var _contractsTab = toolbox.loadUi("contracts", mywindow);
  var _tabindex = toolbox.tabTabIndex(_tab,_pricesTab);

  var _contract        = _contractsTab.findChild("_contract");
  var _new             = _contractsTab.findChild("_new");
  var _edit            = _contractsTab.findChild("_edit");
  var _view            = _contractsTab.findChild("_view");
  var _delete          = _contractsTab.findChild("_delete");

  _contract.addColumn(qsTr("Number"),        -1, Qt.AlignLeft,  true, "contract_number");
  _contract.addColumn(qsTr("Effective"),     -1, Qt.AlignCenter,true, "contract_effective");
  _contract.addColumn(qsTr("Expires"),       -1, Qt.AlignCenter,true, "contract_expires");
  _contract.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  _contract.addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");
  _contract.addColumn(qsTr("Pricing Type"),  -1, Qt.AlignLeft,  true, "f_pricingtype");
  _contract.addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "f_index");
  _contract.addColumn(qsTr("Price"),         -1, Qt.AlignRig,   true, "contractitem_pctmarkup");

  _contract["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);

  _new.clicked.connect(sNew);
  _edit.clicked.connect(sEdit);
  _view.clicked.connect(sView);
  _delete.clicked.connect(sDelete);

  _item.newId.connect(handleUsesContract);
  _vendor.newId.connect(fillList);

}
catch (e)
{
  QMessageBox.critical(mywindow, "itemSource",
                       qsTr("itemSource.js exception: ") + e);
}

function handleUsesContract()
{
  try
  {
    var params = new Object();
    params.item_id = _item.id();
    var data = toolbox.executeQuery("SELECT itemcontract_uses_contract "
                                   +"FROM cgms.itemcontract "
                                   +"WHERE (itemcontract_item_id=<? value('item_id') ?>);", params);
    if (data.first())
    {
      if (data.value("itemcontract_uses_contract"))
      {
        toolbox.tabRemoveTab(_tab, _tabindex, _pricesTab);
        toolbox.tabInsertTab(_tab, _tabindex, _contractsTab, qsTr("Contracts"));
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("handleUsesContract exception: ") + e);
  }
}

function fillList()
{
  try
  {
    var params = new Object();
    _contract.clear();
    params.item_id = _item.id();
    params.target_id = _vendor.id();
    params.target_type = "V";
    params.marketindex      = qsTr("Market Index");
    params.pricingschedule  = qsTr("Pricing Schedule");
    params.fixed            = qsTr("Fixed Price");
    var data = toolbox.executeDbQuery("contract", "detail", params);
    if (data.first())
      _contract.populate(data, true);
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("fillList exception: ") + e);
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  try
  {
    if (pMenu == null)
      pMenu = _contract.findChild("_menu");
    if (pMenu != null)
    {
      var tmpact = toolbox.menuAddAction(pMenu, qsTr("Edit..."), privileges.check("MaintainContract"));
      tmpact.triggered.connect(sEdit);
                
      tmpact = toolbox.menuAddAction(pMenu, qsTr("View..."), privileges.check("ViewContract"));
      tmpact.triggered.connect(sView);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.item_id = _item.id();
    params.vend_id = _vendor.id();
    params.mode = "new";
    var newdlg = toolbox.openWindow("contract", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
    fillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("sNew exception: ") + e);
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.contract_id = _contract.id();
    params.mode = "edit";
    var newdlg = toolbox.openWindow("contract", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
    fillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("edit exception: ") + e);
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.contract_id = _contract.id();
    params.mode = "view";
    var newdlg = toolbox.openWindow("contract", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         qsTr("view exception: ") + e);
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Contract?"),
                            qsTr("Are you sure you want to delete the selected Contract?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.terminal_id = _contrace.id();

    var qry = "SELECT cgms.deleteContract(<? value('contract_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Contract"),
                             storedProcErrorLookup("deleteContract", result, cgmsErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    fillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "itemSource",
                         "sDelete exception: " + e); 
  }
}

