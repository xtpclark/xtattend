debugger;

include("storedProcErrorLookup");
include("xtattendErrors");

try
{
  var _list = mywindow.findChild("_list");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)
  if (privileges.check("MaintainRegionPort"))
    _list["itemSelected(int)"].connect(sEdit);
  else
    _list["itemSelected(int)"].connect(sView);

  mywindow.setWindowTitle(qsTr("List Ports"));
  mywindow.setListLabel(qsTr("Ports:"));
  mywindow.setReportName("PortList");
  mywindow.setMetaSQLOptions("port", "detail");
  mywindow.setParameterWidgetVisible(true);
  mywindow.setQueryOnStartEnabled(true);
  if (privileges.check("MaintainRegionPort"))
  {
    mywindow.setNewVisible(true);
    mywindow.newAction().triggered.connect(sNew);
  }

  mywindow.parameterWidget().appendComboBox(qsTr("Shipzone"), "shipzone_id",
                   "SELECT shipzone_id, (shipzone_name || '-' || shipzone_descrip) "
                 + "FROM shipzone "
                 + "ORDER BY shipzone_name;");
  mywindow.parameterWidget().applyDefaultFilterSet();

  mywindow.list().addColumn(qsTr("Number"),        -1, Qt.AlignLeft,  true, "port_number");
  mywindow.list().addColumn(qsTr("Description"),   -1, Qt.AlignLeft,  true, "port_descrip");
  mywindow.list().addColumn(qsTr("Shipping Zone"),        -1, Qt.AlignLeft,  true, "shipzone_name");
  mywindow.list().addColumn(qsTr("Market Index"),  -1, Qt.AlignLeft,  true, "costelem_type");
}
catch (e)
{
  QMessageBox.critical(mywindow, "ports",
                       "ports.js exception: " + e);
}

function setParams(params)
{
  try
  {
    params.customer         = qsTr("Customer");
    params.vendor           = qsTr("Vendor");

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "ports.js exception: " + e);

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
      tmpact.enabled = (privileges.check("MaintainRegionPort"));
      tmpact.triggered.connect(sEdit);
  
      tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (privileges.check("MaintainRegionPort"));
      tmpact.triggered.connect(sView);

      tmpact = pMenu.addAction(qsTr("Delete..."));
      tmpact.enabled = (privileges.check("MaintainRegionPort"));
      tmpact.triggered.connect(sDelete);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "ports.js exception: " + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.mode = "new";
    var newdlg = toolbox.openWindow("port", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "sNew exception: " + e); 
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.mode = "edit";
    params.port_id = _list.id();
    var newdlg = toolbox.openWindow("port", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "sEdit exception: " + e); 
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.mode = "view";
    params.port_id = _list.id();
    var newdlg = toolbox.openWindow("port", 0, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "sView exception: " + e); 
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Port?"),
                            qsTr("Are you sure you want to delete the selected Port?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.port_id = _list.id();

    var qry = "SELECT xtattend.deletePort(<? value('port_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Port"),
                             storedProcErrorLookup("deletePort", result, xtattendErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "ports",
                         "sDelete exception: " + e); 
  }
}

