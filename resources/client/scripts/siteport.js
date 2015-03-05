try
{
  var _warehouse       = mywindow.findChild("_warehouse");
  var _port            = mywindow.findChild("_port");
  var _save            = mywindow.findChild("_save");
  var _close           = mywindow.findChild("_close");

  var _siteportId = -1;
  var _mode = '';

  _port.populate("SELECT port_id, port_number"
                +"  FROM xtattend.port"
                +" ORDER BY port_number;");
  _warehouse.setFocus();
  _save.clicked.connect(save);
  _close.clicked.connect(myclose);
  mydialog.rejected.connect(myclose);
}
catch (e)
{
  QMessageBox.critical(mywindow, "siteport",
                       "siteport.js exception: " + e);
}

function set(params)
{
  if ("mode" in params)
    _mode = params.mode;

  if ("siteport_id" in params)
  {
    _siteportId = params.siteport_id;
    populate();
  }

  if (_mode == "view")
  {
    _save.hide();
    _warehouse.readOnly = true;
    _port.readOnly = true;
  }
}

function populate()
{
  try
  {
    var params = new Object();
    params.siteport_id = _siteportId;

    var qry = "SELECT * "
            + "FROM CGMS.siteport "
            + "WHERE (siteport_id = <? value('siteport_id') ?>);";
    var data = toolbox.executeQuery(qry, params);
    if (data.first())
    {
      _warehouse.setId(data.value("siteport_site_id"));
      _port.setId(data.value("siteport_port_id"));
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
    QMessageBox.critical(mywindow, "siteport",
                         "populate exception: " + e);
  }
}

function save()
{
  try
  {
    if (_mode == "new")
    {
      var qry = "INSERT INTO xtattend.siteport (siteport_site_id, siteport_port_id) "
              + "VALUES (<? value('siteport_site_id') ?>, "
              + "        <? value('siteport_port_id') ?>);";
    }
    else
    {
      var qry = "UPDATE xtattend.siteport "
              + "SET siteport_site_id= <? value('siteport_site_id') ?>, "
              + "    siteport_port_id= <? value('siteport_port_id') ?> "
              + "WHERE (siteport_id = <? value('siteport_id') ?>);";
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
    QMessageBox.critical(mywindow, "siteport",
                         "save exception: " + e);
  }
}

function setParams(params)
{
  try
  {
    params.siteport_id = _siteportId;

    params.siteport_site_id = _warehouse.id();
    params.siteport_port_id = _port.id();

    return true;
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteport",
                         "setParams(params) exception: " + e);
  }
}

function myclose()
{
  try
  {
    if (_mode == "new")
    {
      if (QMessageBox.question(mywindow, qsTr("Save Site/Port?"),
                              qsTr("Are you sure you want to close without saving the new Site/Port?"),
                              QMessageBox.Yes,
                              QMessageBox.No | QMessageBox.Default)
                              == QMessageBox.No)
        return;
    }
    mywindow.close();
  }
  catch (e)
  {
    QMessageBox.critical(mywindow, "siteport",
                         "myclose exception: " + e);
  }
}