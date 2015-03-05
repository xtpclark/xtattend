debugger;
try
{
  var _custid = -1;
  var _mode = '';

  var _tab = mywindow.findChild("_tab");
  var _characteristicsTab = mywindow.findChild("_characteristicsTab");
  var _contractsTab = toolbox.loadUi("contracts", mywindow);
  var _tabindex = toolbox.tabTabIndex(_tab,_characteristicsTab);
  toolbox.tabInsertTab(_tab, _tabindex, _contractsTab, qsTr("Contracts"));

  var _contract = _contractsTab.findChild("_contract");
  var _new = _contractsTab.findChild("_new");
  var _edit = _contractsTab.findChild("_edit");
  var _view = _contractsTab.findChild("_view");
  var _delete = _contractsTab.findChild("_delete");

  _contract.addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item_number");
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
}
catch (e)
{
  QMessageBox.critical(mywindow, "customer",
                       qsTr("customer.js exception: ") + e);
}

function fillList(pCustId)
{
  try
  {
    _custid = pCustId;
    var params = new Object();
    params.cust_id = _custid;
    params.customer = qsTr("Customer");
    params.vendor = qsTr("Vendor");

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
    QMessageBox.critical(mywindow, "customer",
                         qsTr("fillList exception: ") + e);
  }
}

function save(pItemId)
{
  try
  {
    return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "customer",
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
    QMessageBox.critical(mywindow, "customer",
                         qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.cust_id = _custid;
    params.mode = "new";
    var newdlg = toolbox.openWindow("contract", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "customer",
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
    QMessageBox.critical(mywindow, "customer",
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
    QMessageBox.critical(mywindow, "customer",
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
    QMessageBox.critical(mywindow, "customer",
                         "sDelete exception: " + e); 
  }
}
