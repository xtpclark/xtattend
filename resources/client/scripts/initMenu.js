debugger;

// Change the search_path to ensure existing client code works with tables moved to xtattend schema
var qry = toolbox.executeQuery("SHOW search_path;", new Object);
if (! qry.first())
  toolbox.messageBox("critical", mainwindow, qsTr("Initialize xtattend failed"),
                     qsTr("Failed to initialize the CGMS package. "
                        + "This functionality may not work correctly. ")
                        .arg(qry.lastError().databaseText));
else
{
  // If the search path is empty set the base value to public
  var search_path = qry.value("search_path");
  if (search_path == "")
  {
    search_path = "public";
  }

  // Prepend xtmfg to the existing search path.
  qry = toolbox.executeQuery("SET search_path TO xtattend, " + search_path + ";", new Object);
  if (!qry.isActive())
  {
    toolbox.messageBox("critical", mainwindow, qsTr("Initializing CGMS failed"),
                       qsTr("Failed to initialize the CGMS package. This "
                          + "functionality may not work correctly. %1")
                          .arg(qry.lastError().databaseText));
  }
}

var tmpaction;

function sContracts()
{
  var wind = toolbox.newDisplay("contracts", 0, Qt.NonModal, Qt.Window);
}

function sDspContractCostedBOM()
{
  var wind = toolbox.newDisplay("dspContractCostedBOM", 0, Qt.NonModal, Qt.Window);
}

function sMktCosts()
{
  var wind = toolbox.newDisplay("mktcosts", 0, Qt.NonModal, Qt.Window);
}

function sPorts()
{
  var wind = toolbox.newDisplay("ports", 0, Qt.NonModal, Qt.Window);
}

function sShipzones()
{
  var wind = toolbox.newDisplay("shippingZones", 0, Qt.NonModal, Qt.Window);
}

function sSitePorts()
{
  var wind = toolbox.newDisplay("siteports", 0, Qt.NonModal, Qt.Window);
}

var menuSales = mainwindow.findChild("menu.sales");
var salesPricingMenu = mainwindow.findChild("menu.sales.pricing");

var tmpaction = salesPricingMenu.addAction(qsTranslate("menuSales", "Ports..."));
tmpaction.enabled = privileges.value("MaintainRegionPort");
tmpaction.setData("Ports");
tmpaction.objectName = "so.ports";
tmpaction.triggered.connect(sPorts);
salesPricingMenu.insertAction(mainwindow.findChild("so.pricingSchedules"), tmpaction);

var tmpaction = salesPricingMenu.addAction(qsTranslate("menuSales", "Contracts..."));
tmpaction.enabled = privileges.value("MaintainContract");
tmpaction.setData("Contracts");
tmpaction.objectName = "so.contracts";
tmpaction.triggered.connect(sContracts);
salesPricingMenu.insertAction(mainwindow.findChild("so.pricingSchedules"), tmpaction);

var tmpaction = salesPricingMenu.addAction(qsTranslate("menuSales", "Market Costs..."));
tmpaction.enabled = privileges.value("MaintainMktCost");
tmpaction.setData("MktCosts");
tmpaction.objectName = "so.mktcosts";
tmpaction.triggered.connect(sMktCosts);
salesPricingMenu.insertAction(mainwindow.findChild("so.pricingSchedules"), tmpaction);

var menuInventory = mainwindow.findChild("menu.im");
var inventorySiteMenu = mainwindow.findChild("menu.im.warehouse");

var tmpaction = inventorySiteMenu.addAction(qsTranslate("menuInventory", "Ports..."));
tmpaction.enabled = privileges.value("MaintainRegionPort");
tmpaction.setData("SitePorts");
tmpaction.objectName = "im.siteports";
tmpaction.triggered.connect(sSitePorts);
inventorySiteMenu.insertAction(mainwindow.findChild("im.warehousesLocations"), tmpaction);

var menuProducts = mainwindow.findChild("menu.prod");
var productCostingMenu = mainwindow.findChild("menu.prod.costingreports");

var tmpaction = productCostingMenu.addAction(qsTranslate("menuProducts", "Contract Costed BOM..."));
tmpaction.enabled = privileges.value("ViewContract");
tmpaction.setData("dspContractCostedBOM");
tmpaction.objectName = "prod.dspContractCostedBOM";
tmpaction.triggered.connect(sDspContractCostedBOM);
inventorySiteMenu.insertAction(mainwindow.findChild("pd.dspCostedSingleLevelBOM"), tmpaction);

