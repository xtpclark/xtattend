debugger;

include("storedProcErrorLookup");
include("xtattendErrors");

try
{
  var _list = mywindow.findChild("_list");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);
  if (privileges.check("MaintainContract"))
    _list["itemSelected(int)"].connect(sEdit);
  else
    _list["itemSelected(int)"].connect(sView);

  mywindow.setWindowTitle(qsTr("List Contracts"));
  mywindow.setListLabel(qsTr("Contracts"));
  mywindow.setReportName("ContractList");
  mywindow.setMetaSQLOptions("contract", "detail");
  mywindow.setParameterWidgetVisible(true);
  if (privileges.check("MaintainContract"))
  {
    mywindow.setNewVisible(true);
    mywindow.newAction().triggered.connect(sNew);
  }

  mywindow.parameterWidget().append(qsTr("Start Date"), "startDate", ParameterWidget.Date);
  mywindow.parameterWidget().append(qsTr("End Date"), "endDate", ParameterWidget.Date);
  mywindow.parameterWidget().append(qsTr("Customer"), "cust_id", ParameterWidget.Customer);
  mywindow.parameterWidget().append(qsTr("Vendor"), "vend_id", ParameterWidget.Vendor);
  mywindow.parameterWidget().append(qsTr("Item"), "item_id", ParameterWidget.Item);
  mywindow.parameterWidget().append(qsTr("Site"), "warehous_id", ParameterWidget.Site);
  mywindow.parameterWidget().appendComboBox(qsTr("Port"), "port_id",
                   "SELECT port_id, (port_number || '-' || port_descrip) "
                 + "FROM xtattend.port "
                 + "ORDER BY port_number;");
  mywindow.parameterWidget().applyDefaultFilterSet();

  mywindow.list().addColumn(qsTr("Number"),        -1, Qt.AlignLeft,  true, "contract_number");
  mywindow.list().addColumn(qsTr("Type"),          -1, Qt.AlignLeft,  true, "f_targettype");
  mywindow.list().addColumn(qsTr("Target"),        -1, Qt.AlignLeft,  true, "f_target");
  mywindow.list().addColumn(qsTr("Effective"),     -1, Qt.AlignCenter,true, "contract_effective");
  mywindow.list().addColumn(qsTr("Expires"),       -1, Qt.AlignCenter,true, "contract_expires");
  mywindow.list().addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item_number");
  mywindow.list().addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  mywindow.list().addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");
  mywindow.list().addColumn(qsTr("Pricing Type"),  -1, Qt.AlignLeft,  true, "f_pricingtype");
  mywindow.list().addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "f_index");
  mywindow.list().addColumn(qsTr("Price"),         -1, Qt.AlignRig,   true, "contractitem_pctmarkup");
}
catch (e)
{
  QMessageBox.critical(mywindow, "contracts",
                       "contracts.js exception: " + e);
}

function setParams(params)
{
  try
  {
    params.customer         = qsTr("Customer");
    params.vendor           = qsTr("Vendor");
    params.marketindex      = qsTr("Market Index");
    params.pricingschedule  = qsTr("Pricing Schedule");
    params.fixed            = qsTr("Fixed Price");

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "contracts.js exception: " + e);

    return false;
  }
}

function populateMenu(pMenu, pItem, pCol)
{
  try
  {
    if(pMenu == null)
      pMenu = _list.findChild("_menu");
  
    if(pMenu != null)
    {
      var tmpact = pMenu.addAction(qsTr("Edit..."));
      tmpact.enabled = (privileges.check("MaintainContract"));
      tmpact.triggered.connect(sEdit);
  
      tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (privileges.check("MaintainContract") || privileges.check("ViewContract"));
      tmpact.triggered.connect(sView);

      tmpact = pMenu.addAction(qsTr("Delete..."));
      tmpact.enabled = (privileges.check("MaintainContract"));
      tmpact.triggered.connect(sDelete);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "contracts.js exception: " + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.mode = "new";
    var newdlg = toolbox.openWindow("contract", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "sNew exception: " + e); 
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.mode = "edit";
    params.contract_id = _list.id();
    var newdlg = toolbox.openWindow("contract", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "sEdit exception: " + e); 
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.mode = "view";
    params.contract_id = _list.id();
    var newdlg = toolbox.openWindow("contract", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "sView exception: " + e); 
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
    params.contract_id = _list.id();

    var qry = "SELECT xtattend.deleteContract(<? value('contract_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Contract"),
                             storedProcErrorLookup("deleteContract", result, xtattendErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "contracts",
                         "sDelete exception: " + e); 
  }
}

