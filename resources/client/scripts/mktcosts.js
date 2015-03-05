debugger;

include("storedProcErrorLookup");
include("xtattendErrors");

try
{
  var _list = mywindow.findChild("_list");
  _list["populateMenu(QMenu *, XTreeWidgetItem *, int)"].connect(populateMenu)
  if (privileges.check("MaintainMktCost"))
    _list["itemSelected(int)"].connect(sEdit);
  else
    _list["itemSelected(int)"].connect(sView);

  mywindow.setWindowTitle(qsTr("List Market Costs"));
  mywindow.setListLabel(qsTr("Market Costs:"));
  mywindow.setReportName("MktCostList");
  mywindow.setMetaSQLOptions("mktcost", "detail");
  mywindow.setParameterWidgetVisible(true);
  if (privileges.check("MaintainMktCost"))
  {
    mywindow.setNewVisible(true);
    mywindow.newAction().triggered.connect(sNew);
  }

  mywindow.parameterWidget().append(qsTr("Start Date"), "startDate", ParameterWidget.Date);
  mywindow.parameterWidget().append(qsTr("End Date"), "endDate", ParameterWidget.Date);
  mywindow.parameterWidget().append(qsTr("Item"), "item_id", ParameterWidget.Item);
  mywindow.parameterWidget().appendComboBox(qsTr("Product Category"), "prodcat_id",
                   "SELECT prodcat_id, (prodcat_code || '-' || prodcat_descrip) "
                 + "FROM prodcat "
                 + "ORDER BY prodcat_code;");
  mywindow.parameterWidget().appendComboBox(qsTr("Index"), "costelem_id",
                   "SELECT costelem_id, costelem_type "
                 + "FROM costelem "
                 + "ORDER BY costelem_type;");
  mywindow.parameterWidget().applyDefaultFilterSet();

  mywindow.list().addColumn(qsTr("Item"),          -1, Qt.AlignLeft,  true, "item_number");
  mywindow.list().addColumn(qsTr("Index"),         -1, Qt.AlignLeft,  true, "costelem_type");
  mywindow.list().addColumn(qsTr("Cost"),          -1, Qt.AlignLeft,  true, "mktcost_cost");
  mywindow.list().addColumn(qsTr("Updated"),       -1, Qt.AlignCenter,true, "mktcost_updated");
}
catch (e)
{
  QMessageBox.critical(mywindow, "mktcosts",
                       "mktcosts.js exception: " + e);
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
      tmpact.enabled = (privileges.check("MaintainMktCost"));
      tmpact.triggered.connect(sEdit);
  
      tmpact = pMenu.addAction(qsTr("View..."));
      tmpact.enabled = (privileges.check("MaintainMktCost") || privileges.check("ViewMktCost"));
      tmpact.triggered.connect(sView);

      tmpact = pMenu.addAction(qsTr("Delete..."));
      tmpact.enabled = (privileges.check("MaintainMktCost"));
      tmpact.triggered.connect(sDelete);
    }
  }
  catch(e)
  {
    QMessageBox.critical(mywindow, "mktcosts",
                         "mktcosts.js exception: " + e);
  }
}

function sNew()
{
  try
  {
    var params = new Object();
    params.mode = "new";
    var newdlg = toolbox.openWindow("mktcost", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcosts",
                         "sNew exception: " + e); 
  }
}

function sEdit()
{
  try
  {
    var params = new Object();
    params.mode = "edit";
    params.mktcost_id = _list.id();
    var newdlg = toolbox.openWindow("mktcost", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    if (newdlg.exec() == QDialog.Accepted)
      mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcosts",
                         "sEdit exception: " + e); 
  }
}

function sView()
{
  try
  {
    var params = new Object();
    params.mode = "view";
    params.mktcost_id = _list.id();
    var newdlg = toolbox.openWindow("mktcost", mywindow, 0, 1);
    var tmp = toolbox.lastWindow().set(params);
    var execval = newdlg.exec;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcosts",
                         "sView exception: " + e); 
  }
}

function sDelete()
{
  try
  {
    if (QMessageBox.question(mywindow, qsTr("Delete Market Cost?"),
                            qsTr("Are you sure you want to delete the selected Market Cost?"),
                            QMessageBox.Yes,
                            QMessageBox.No | QMessageBox.Default)
                            == QMessageBox.No)
      return;

    var params = new Object();
    params.mktcost_id = _list.id();

    var qry = "SELECT xtattend.deleteMktCost(<? value('mktcost_id') ?>) AS result;";

    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      var result = data.value("result");
      if (result < 0)
      {
        QMessageBox.critical(mywindow,
                             qsTr("Could not Delete Market Cost"),
                             storedProcErrorLookup("deleteMktCost", result, xtattendErrors));
        return;
      }
    }
    else if (data.lastError().type != QSqlError.NoError)
      throw new Error(data.lastError().text);

    mywindow.sFillList();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcosts",
                         "sDelete exception: " + e); 
  }
}

