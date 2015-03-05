debugger;
try
{
  var _itemid = -1;
  var _mode = '';

  var _usesContract = toolbox.createWidget("XCheckBox", mywindow, "_usesContract");
  _usesContract.text = qsTr("Uses Contract");
  _usesContract.forgetful = true;
  var _layout  = toolbox.widgetGetLayout(mywindow.findChild("_configured"));
  _layout.addWidget(_usesContract, 0, 5);

  var _tab = mywindow.findChild("_tab");
  var _sourcesTab = mywindow.findChild("_sourcesTab");
  var _contractsTab = toolbox.loadUi("contracts", mywindow);
  var _tabindex = toolbox.tabTabIndex(_tab,_sourcesTab);

  var _contract = _contractsTab.findChild("_contract");
  var _new = _contractsTab.findChild("_new");
  var _edit = _contractsTab.findChild("_edit");
  var _view = _contractsTab.findChild("_view");
  var _delete = _contractsTab.findChild("_delete");

  _contract.addColumn(qsTr("Type"),          -1, Qt.AlignLeft,  true, "f_targettype");
  _contract.addColumn(qsTr("Target"),        -1, Qt.AlignLeft,  true, "f_target");
  _contract.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  _contract.addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");
  _contract.addColumn(qsTr("Market Index"),  -1, Qt.AlignLeft,  true, "costelem_type");
  _contract.addColumn(qsTr("Pct. Markup"),   -1, Qt.AlignRig,   true, "contract_pctmarkup");
  _contract.addColumn(qsTr("Currency"),      -1, Qt.AlignLeft,  true, "curr_name");
  _contract.addColumn(qsTr("Effective"),     -1, Qt.AlignCenter,true, "contract_effective");
  _contract.addColumn(qsTr("Expires"),       -1, Qt.AlignCenter,true, "contract_expires");

  _contract["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);

  mywindow["saved(int)"].connect(save);
  mywindow["newId(int)"].connect(fillList);
  _new.clicked.connect(sNew);
  _edit.clicked.connect(sEdit);
  _view.clicked.connect(sView);
  _delete.clicked.connect(sDelete);
  _usesContract.toggled.connect(handleUsesContract);

}
catch (e)
{
  QMessageBox.critical(mywindow, "item",
                       qsTr("item.js exception: ") + e);
}

function handleUsesContract()
{
  try
  {
    if (_usesContract.checked)
    {
//      toolbox.tabRemoveTab(_tab, _tabindex, _sourcesTab);
      toolbox.tabInsertTab(_tab, _tabindex, _contractsTab, qsTr("Contracts"));
    }
    else
    {
      toolbox.tabRemoveTab(_tab, _tabindex, _contractsTab);
//      toolbox.tabInsertTab(_tab, _tabindex, _sourcesTab, qsTr("Sources"));
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         qsTr("handleUsesContract exception: ") + e);
  }
}

function fillList(pItemId)
{
  try
  {
    _itemid = pItemId;
    var params = new Object();
    params.item_id = _itemid;
    params.customer = qsTr("Customer");
    params.vendor = qsTr("Vendor");

    // retrieve itemcontract row
    var data = toolbox.executeDbQuery("itemcontract", "detail", params);
    if (data.first())
      _usesContract.checked = data.value("itemcontract_uses_contract");
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }

    // populate _contract list
    _contract.clear();
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
    QMessageBox.critical(mywindow, "item",
                         qsTr("fillList exception: ") + e);
  }
}

function save(pItemId)
{
  try
  {
    // save itemcontract row
    _itemid = pItemId;
    var params = new Object();
    params.item_id = _itemid;
    params.usesContract = _usesContract.checked;
    var data = toolbox.executeDbQuery("itemcontract", "update", params);
    if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         qsTr("save exception: ") + e);
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

      var tmpact = toolbox.menuAddAction(pMenu, qsTr("Delete..."), privileges.check("MaintainContract"));
      tmpact.triggered.connect(sDelete);
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.item_id = _itemid;
    params.mode = "new";
    var newdlg = toolbox.openWindow("contract", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
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
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         qsTr("sEdit exception: ") + e);
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
    QMessageBox.critical(mywindow, "item",
                         qsTr("sView exception: ") + e);
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
    params.contract_id = _contract.id();

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

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "item",
                         "sDelete exception: " + e); 
  }
}
