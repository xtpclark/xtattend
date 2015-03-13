debugger;
/* This QtScript example shows the basic scripting required to make a simple
   window designed with Qt Designer and imported into an xTuple ERP database
   do the following things:
   - close the window when the user clicks on a Close button
   - query the database and display the data on-screen
   - print a report

   The window contains the following widgets on it:
   _group   a WarehouseGroup which lets user choose either a single warehouse
            or all warehouses
   _list    an XTreeWidget to display the resulting data in tabular form
   _update  an XCheckBox with which the user can request automatic updates
   _close   \
   _query    } QPushButtons to perform the obvious
   _print   /
*/

/*
   The _group widget lets the user choose selection criteria for the query.
   The getParams() function checks the _group widget and creates a parameter
   object to hold the selection criteria. This behaves much like an OpenRPT
   ParameterList object in C++ for passing data to a MetaSQL query.
   The getParams() function is called by query() and print() below.
*/

var _dates     = mywindow.findChild("_dates");
_dates.setStartNull(qsTr("Earliest"), mainwindow.startOfTime(), true);
_dates.setEndNull(qsTr("Latest"),     mainwindow.endOfTime(),   true);

function getParams()
{
  // create an object to hold the parameters
  var params = new Object;

 alert(mywindow.findChild("_crmacct"));

  if(mywindow.findChild("_crmacct").isSelected())
  {
    params.crmacct = mywindow.findChild("_crmacct").id();
    params.startDate   = _dates.startDate;
    params.endDate     = _dates.endDate;
  }
  // hand the parameter list back to the caller
    params.startDate   = _dates.startDate;
    params.endDate     = _dates.endDate;
  return params;
}

// Now define a query, run it, and populate the _list with the results.
function query()
{
  var params = getParams();     // get selection criteria from the window

  /* Execute a MetaSQL statement, passing it parameters and saving the result
     set in a variable named 'qry'. The first column in the query should be an
     id column and /every/ column should be named.
     In addition to the list of data columns to display, the query contains
     several special columns that tell _list how to format some of the data.
  */
var qry = toolbox.executeDbQuery("DisplayItemLocations", "DisplayItemLocations", params);

  // populate the _list XTreeWidget with the query results saved in qry.
  mywindow.findChild("_list").populate(qry);
}

/* Call OpenRPT to print a report. Make sure the main query in the report is
   similar to the query above or the user is going to be very surprised.
*/
function print()
{
  // Call the named report and pass it the same parameters used by query().
  toolbox.printReport("ItemLocationsByWarehouse", getParams());
}

/* This function checks whether the _update widget is checked or not. If
   _update is checked when tick() gets called then it will repopulate _list.
*/
function tick()
{
  if (mywindow.findChild("_update").checked)
  {
    query();
  }
}

/* Now we have to set up the display and connect the various objects together
   in a way that will make the display work when users click the buttons.

   First connect the buttons to the appropriate functions.  Windows know how to
   close themselves so connect the _close button to the generic close function.
*/
mywindow.findChild("_close").clicked.connect(mywindow, "close");

// connect the _query and _print buttons to the functions defined above
mywindow.findChild("_query").clicked.connect(query);
mywindow.findChild("_print").clicked.connect(print);

/* xTuple ERP has an internal repeating timer. Connect the tick() function to
   this timer so the _list gets updated automatically if the user so desires.
*/
mainwindow.tick.connect(tick);

/* When _list gets created by the window, it is empty - no rows and no columns.
   Define the columns here and let query() create the rows. addColumn() takes
   the following arguments:
   1) column title text
   2) column width in pixels
   3) default column alignment - see the Qt docs for Qt::Alignment
   4) default visibility - is this column visible when the window is first shown
   5) column name from the query to put in this column of the display
*/
var list = mywindow.findChild("_list");

list.addColumn("Name",               100, 1, true, "cntct_name");
list.addColumn("Email",              100, 1, true, "cntct_email");
list.addColumn("Group",           100, 1, true, "attgrp_name");
list.addColumn("Session", 100, 1, true, "attsess_name");
list.addColumn("Status",           20, 3, true, "attstat_code");
list.addColumn("Recorded",         100, 1, true, "attally_recorded");

// and that's it
