debugger;

include("storedProcErrorLookup");
include("xtattendErrors");

try
{
  var _list = mywindow.findChild("_list");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu);
  if (privileges.check("MaintainRegionPort"))
    _list["itemSelected(int)"].connect(sEdit);
  else
    _list["itemSelected(int)"].connect(sView);

  mywindow.setWindowTitle(qsTr("List Regions"));
  mywindow.setListLabel(qsTr("Regions:"));
  mywindow.setReportName("RegionList");
  mywindow.setMetaSQLOptions("region", "detail");
  mywindow.setParameterWidgetVisible(false);
  mywindow.setQueryOnStartEnabled(true);
  if (privileges.check("MaintainRegionPort"))
  {
    mywindow.setNewVisible(true);
    mywindow.newAction().triggered.connect(sNew);
  }

  mywindow.list().addColumn(qsTr("Number"),        -1, Qt.AlignLeft,  true, "region_number");
  mywindow.list().addColumn(qsTr("Description"),   -1, Qt.AlignLeft,  true, "region_descrip");
  mywindow.list().addColumn(qsTr("Market Index"),  -1, Qt.AlignLeft,  true, "costelem_type");
}
catch (e)
{
  QMessageBox.critical(mywindow, "regions",
                       "regions.js exception: " + e);
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
    QMessageBox.critical(mywindow, "regions",
                         "regions.js exception: " + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.mode = "new";
    var newdlg = toolbox.openWindow("region", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "regions",
                         "sNew exception: " + e); 
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.mode = "edit";
    params.region_id = _list.id();
    var newdlg = toolbox.openWindow("region", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "regions",
                         "sEdit exception: " + e); 
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.mode = "view";
    params.region_id = _list.id();
    var newdlg = toolbox.openWindow("region", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "regions",
                         "sView exception: " + e); 
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Region?"),
                            qsTr("Are you sure you want to delete the selected Region?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.region_id = _list.id();

    var qry = "SELECT xtattend.deleteRegion(<? value('region_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Region"),
                             storedProcErrorLookup("deleteRegion", result, xtattendErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "regions",
                         "sDelete exception: " + e); 
  }
}

