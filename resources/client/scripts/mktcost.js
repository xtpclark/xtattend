try
{
  var _item            = mywindow.findChild("_item");
  var _costelem        = mywindow.findChild("_costelem");
  var _cost            = mywindow.findChild("_cost");
  var _updated         = mywindow.findChild("_updated");
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _mktcostId = -1;
  var _mode = '';

  _cost.setValidator(mainwindow.costVal());
  _costelem.populate("SELECT costelem_id, costelem_type"
                    +"  FROM costelem"
                    +" ORDER BY costelem_type;");
  _item.setFocus();
  _save.clicked.connect(save);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "mktcost",
                       "mktcost.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("mktcost_id" in params)
  {
    _mktcostId = params.mktcost_id;
    populate();
  }

  if (_mode == "view")
  {
    _save.hide();
    _item.readOnly = true;
    _costelem.readOnly = true;
    _cost.readOnly = true;
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.mktcost_id = _mktcostId;

    var qry = "SELECT * "
            + "FROM CGMS.mktcost "
            + "WHERE (mktcost_id = <? value('mktcost_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _item.setId(data.value("mktcost_item_id"));
      _costelem.setId(data.value("mktcost_costelem_id"));
      _cost.setDouble(data.value("mktcost_cost"));
      _updated.setDate(data.value("mktcost_updated"));
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
    QMessageBox.critical(mywindow, "mktcost",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO cgms.mktcost (mktcost_item_id, mktcost_costelem_id, mktcost_cost, mktcost_updated) "
              + "VALUES (<? value('mktcost_item_id') ?>, "
              + "        <? value('mktcost_costelem_id') ?>,"
              + "        <? value('mktcost_cost') ?>,"
              + "        CURRENT_DATE);";
    }
    else
    {
      var qry = "UPDATE cgms.mktcost "
              + "SET mktcost_item_id= <? value('mktcost_item_id') ?>, "
              + "    mktcost_costelem_id= <? value('mktcost_costelem_id') ?>,"
              + "    mktcost_cost= <? value('mktcost_cost') ?>,"
              + "    mktcost_updated = CURRENT_DATE "
              + "WHERE (mktcost_id = <? value('mktcost_id') ?>);";
    }
 
    var params = new Object();

    if (setParams(params))
    {
      var data = toolbox.executeQuery(qry, params);

      if (data.lastError().type != QSqlError.NoError)
      {
        QMessageBox.critical(mywindow, qsTr("Database Error"),
                             data.lastError().text);
        mydialog.reject();
      }
      _mode = "";
      mydialog.accept();
    }
    else
      return;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcost",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.mktcost_id = _mktcostId;

    params.mktcost_item_id = _item.id();
    params.mktcost_costelem_id = _costelem.id();
    params.mktcost_cost = _cost.toDouble();

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcost",
                         "setParams(params) exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Market Cost?"),
                              qsTr("Are you sure you want to close without saving the new Market Cost?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "mktcost",
                         "myclose exception: " + e);
  }
}