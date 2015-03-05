debugger;

try
{
  var _number          = mywindow.findChild("_number");
  var _descrip         = mywindow.findChild("_descrip");
  var _custType        = mywindow.findChild("_custType");
  var _vendType        = mywindow.findChild("_vendType");
  var _cust            = mywindow.findChild("_cust");
  var _vend            = mywindow.findChild("_vend");
  var _notes           = mywindow.findChild("_notes");
  var _refContract     = mywindow.findChild("_refContract");
  var _dates           = mywindow.findChild("_dates");

  _dates.setStartNull(qsTr("Always"), mainwindow.startOfTime(), true);
  _dates.setStartCaption(qsTr("Effective:"));
  _dates.setEndNull(qsTr("Never"), mainwindow.endOfTime(), true);
  _dates.setEndCaption(qsTr("Expires:"));

  var _contractItem    = mywindow.findChild("_contractItem");
  var _new             = mywindow.findChild("_new");
  var _edit            = mywindow.findChild("_edit");
  var _view            = mywindow.findChild("_view");
  var _delete          = mywindow.findChild("_delete");
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _contractId = -1;
  var _mode = '';

  _refContract.populate( "SELECT -1 AS contract_id, 'None' AS contract_number "
                       + "UNION ALL "
                       + "SELECT contract_id, contract_number"
                       +"  FROM xtattend.contract"
                       +" ORDER BY contract_number;");

  _contractItem.addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item_number");
  _contractItem.addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  _contractItem.addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");

  _contractItem["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);

  if(privileges.check("MaintainContract"))
  {
    _contractItem.valid.connect(_edit, "setEnabled");
    _contractItem.valid.connect(_view, "setEnabled");
    _contractItem.valid.connect(_delete, "setEnabled");
    _contractItem.itemSelected.connect(_edit, "animateClick");
  }
  else
  {
    _contractItem.itemSelected.connect(_view, "animateClick");
    _new.enabled=false;
  }
  _new.clicked.connect(sNew);
  _edit.clicked.connect(sEdit);
  _view.clicked.connect(sView);
  _delete.clicked.connect(sDelete);

  _save.clicked.connect(sSave);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "contract",
                       "contract.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("contract_id" in params)
  {
    _contractId = params.contract_id;
    sPopulate();
  }

  if ("cust_id" in params)
  {
    _custType.setChecked(true);
    _cust.setId(params.cust_id);
  }

  if ("vend_id" in params)
  {
    _vendType.setChecked(true);
    _vend.setId(params.vend_id);
  }

  if ("item_id" in params)
  {
    _item.setId(params.item_id);
  }

  if (_mode == "view")
  {
    _save.hide();
    _new.hide();
    _edit.hide();
    _delete.hide();
    _custType.readOnly = true;
    _vendType.readOnly = true;
    _cust.readOnly = true;
    _vend.readOnly = true;
    _dates.readOnly = true;
  }
}

function sPopulate()
{
  try
  {
    var params = new Object();
    params.contract_id = _contractId;

    var qry = "SELECT * "
            + "FROM CGMS.contract "
            + "WHERE (contract_id = <? value('contract_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      if (data.value("contract_target_type") == "C")
      {
        _custType.setChecked(true);
        _cust.setId(data.value("contract_target_id"));
      }
      else
      {
        _vendType.checked = true;
        _vend.setId(data.value("contract_target_id"));
      }
      _number.text = data.value("contract_number");
      _descrip.text = data.value("contract_descrip");
      _refContract.setId(data.value("contract_ref_contract_id"));
      _notes.plainText = data.value("contract_notes");
      _dates.startDate = data.value("contract_effective");
      _dates.endDate = data.value("contract_expires");
      sFillList();
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
    QMessageBox.critical(mywindow, "port",
                         "sPopulate exception: " + e);
  }
}

function sSave()
{
  try
  {
    save(true);
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         "sSave exception: " + e);
  }
}

function save(pCaptive)
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO xtattend.contract (contract_number, contract_descrip, contract_notes, "
              + "                           contract_target_type, contract_target_id, contract_ref_contract_id, "
              + "                           contract_effective, contract_expires) "
              + "VALUES (<? value('contract_number') ?>, "
              + "        <? value('contract_descrip') ?>, "
              + "        <? value('contract_notes') ?>, "
              + "        <? value('contract_target_type') ?>, "
              + "        <? value('contract_target_id') ?>,"
              + "        <? value('contract_ref_contract_id') ?>,"
              + "        <? value('contract_effective') ?>,"
              + "        <? value('contract_expires') ?>) "
              + "RETURNING contract_id;";
    }
    else
    {
      var qry = "UPDATE xtattend.contract "
              + "SET contract_target_type = <? value('contract_target_type') ?>, "
              + "    contract_target_id = <? value('contract_target_id') ?>,"
              + "    contract_number = <? value('contract_number') ?>,"
              + "    contract_descrip = <? value('contract_descrip') ?>,"
              + "    contract_notes = <? value('contract_notes') ?>,"
              + "    contract_ref_contract_id = <? value('contract_ref_contract_id') ?>,"
              + "    contract_effective = <? value('contract_effective') ?>,"
              + "    contract_expires = <? value('contract_expires') ?> "
              + "WHERE (contract_id = <? value('contract_id') ?>);";
    }
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(qry, params);

      if (data.first())
      {
        if (_mode == "new")
          _contractId = data.value("contract_id");
      }
      else if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        mydialog.reject();
      }
      _mode = "";
      if (pCaptive)
        mydialog.accept();
      else
        _mode = "edit";
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.contract_id = _contractId;

    if (_custType.checked)
    {
      params.contract_target_type = "C";
      params.contract_target_id = _cust.id();
    }
    else
    {
      params.contract_target_type = "V";
      params.contract_target_id = _vend.id();
    }

    params.contract_number = _number.text;
    params.contract_descrip = _number.text;
    params.contract_notes = _notes.plainText;
    params.contract_ref_contract_id = _refContract.id();
    params.contract_effective = _dates.startDate;
    params.contract_expires = _dates.endDate;

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         "setParams(params) exception: " + e);
  }
}

function sFillList()
{
  try
  {
    var params = new Object();
    params.contract_id = _contractId;

    _contractItem.clear();
    var data = toolbox.executeDbQuery("contractitem", "detail", params);
    if (data.first())
      _contractItem.populate(data, false);
    else if (data.lastError().type != QSqlError.NoError)
    {
      QMessageBox.critical(mywindow, qsTr("Database Error"),
                           data.lastError().text);
      return;
    }
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         qsTr("sFillList exception: ") + e);
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
    QMessageBox.critical(mywindow, "contract",
                         qsTr("populateMenu(pMenu, pItem, pCol) exception: ") + e);
  }
}

function sNew()
{
  try
  {
    save(false);
    var params = new Object();
    params.contract_id = _contractId;
    params.mode = "new";
    var newdlg = toolbox.openWindow("contractItem", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
    sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         qsTr("sNew exception: ") + e);
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.contractitem_id = _contractItem.id();
    params.mode = "edit";
    var newdlg = toolbox.openWindow("contractItem", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
    sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         qsTr("sEdit exception: ") + e);
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.contractitem_id = _contractItem.id();
    params.mode = "view";
    var newdlg = toolbox.openWindow("contractItem", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contractitem",
                         qsTr("sView exception: ") + e);
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Contract Item?"),
                            qsTr("Are you sure you want to delete the selected Contract Item?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.contractitem_id = _contractItem.id();

    var qry = "SELECT xtattend.deleteContractItem(<? value('contractitem_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete ContractItem"),
                             storedProcErrorLookup("deleteContractItem", result, xtattendErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         "sDelete exception: " + e); 
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Contract?"),
                              qsTr("Are you sure you want to close without saving the new Contract?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contract",
                         "myclose exception: " + e);
  }
}