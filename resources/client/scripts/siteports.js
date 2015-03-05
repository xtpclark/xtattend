debugger;

include("storedProcErrorLookup");
include("cgmsErrors");

try
{
  var _list = mywindow.findChild("_list");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)

  mywindow.setWindowTitle(qsTr("List Site/Port Relationships"));
  mywindow.setListLabel(qsTr("Site/Ports:"));
  mywindow.setReportName("SitePortList");
  mywindow.setMetaSQLOptions("siteport", "detail");
  mywindow.setParameterWidgetVisible(true);
  mywindow.setNewVisible(true);
  mywindow.newAction().triggered.connect(sNew);

  mywindow.parameterWidget().append(qsTr("Site"), "warehous_id", ParameterWidget.Site);
  mywindow.parameterWidget().applyDefaultFilterSet();

  mywindow.list().addColumn(qsTr("Site"),          -1, Qt.AlignLeft,  true, "warehous_code");
  mywindow.list().addColumn(qsTr("Port"),          -1, Qt.AlignLeft,  true, "port_number");
}
catch (e)
{
  QMessageBox.critical(mywindow, "siteports",
                       "siteports.js exception: " + e);
}

function setParams(params)
{
  try
  {

    return true;
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "siteports",
                         "siteports.js exception: " + e);

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
    QMessageBox.critical(mywindow, "siteports",
                         "siteports.js exception: " + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.mode = "new";
    var newdlg = toolbox.openWindow("siteport", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteports",
                         "sNew exception: " + e); 
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.mode = "edit";
    params.siteport_id = _list.id();
    var newdlg = toolbox.openWindow("siteport", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteports",
                         "sEdit exception: " + e); 
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.mode = "view";
    params.siteport_id = _list.id();
    var newdlg = toolbox.openWindow("siteport", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteports",
                         "sView exception: " + e); 
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Site/Port Relationship?"),
                            qsTr("Are you sure you want to delete the selected Site/Port?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.siteport_id = _list.id();

    var qry = "SELECT cgms.deleteSitePort(<? value('siteport_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Site/Port"),
                             storedProcErrorLookup("deleteSitePort", result, cgmsErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteports",
                         "sDelete exception: " + e); 
  }
}

