try
{
  var _number          = mywindow.findChild("_number");
  var _descrip         = mywindow.findChild("_descrip");
  var _costelem        = mywindow.findChild("_costelem");
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _regionId = -1;
  var _mode = '';

  _costelem.populate("SELECT costelem_id, costelem_type"
                    +"  FROM costelem"
                    +" ORDER BY costelem_type;");
  _number.setFocus();
  _save.clicked.connect(save);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "region",
                       "region.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("region_id" in params)
  {
    _regionId = params.region_id;
    populate();
  }

  if (_mode == "view")
  {
    _save.hide();
    _new.hide();
    _delete.hide();
    _number.readOnly = true;
    _descrip.readOnly = true;
    _costelem.readOnly = true;
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.region_id = _regionId;

    var qry = "SELECT * "
            + "FROM CGMS.region "
            + "WHERE (region_id = <? value('region_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _number.setText(data.value("region_number"));
      _descrip.setText(data.value("region_descrip"));
      _costelem.setId(data.value("region_costelem_id"));
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
    QMessageBox.critical(mywindow, "region",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO cgms.region (region_number, region_descrip, region_costelem_id) "
              + "VALUES (UPPER(<? value('region_number') ?>), "
              + "        <? value('region_descrip') ?>,"
              + "        <? value('region_costelem_id') ?>);";
    }
    else
    {
      var qry = "UPDATE cgms.region "
              + "SET region_number= UPPER(<? value('region_number') ?>), "
              + "    region_descrip= <? value('region_descrip') ?>,"
              + "    region_costelem_id= <? value('region_costelem_id') ?> "
              + "WHERE (region_id = <? value('region_id') ?>);";
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
    QMessageBox.critical(mywindow, "region",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.region_id = _regionId;

    if (_number.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter Region Number before saving");	
      _number.setFocus();
      return false;
    }
    else
      params.region_number = _number.text;

    if (_descrip.text == '')
    {
      QMessageBox.critical(mywindow, "Can Not Save",
                          "Please enter Region Description before saving");	
      _descrip.setFocus();
      return false;
    }
    else
      params.region_descrip = _descrip.text;

    params.region_costelem_id = _costelem.id();

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "region",
                         "setParams(params) exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Region?"),
                              qsTr("Are you sure you want to close without saving the new Region?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "region",
                         "myclose exception: " + e);
  }
}