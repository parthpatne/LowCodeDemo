param([switch] $Help, [switch] $All, [switch] $ActionHost, [switch] $Setup, [string] $Action, [string[]] $Actions, [switch] $WatchMode, [switch] $NoLint, [switch] $NoPackageRootUpdate, [switch] $CleanupNodeModules)

if ($Help) {
    ("
	Sample Usages:
	--------------
	# To build everything. This needs to be executed at least once for setting up things (npm install)
	powershell -File BuildActionResources.ps1 -All

	# To build just ActionHost
	powershell -File BuildActionResources.ps1 -ActionHost

	# To build just one Action
	powershell -File BuildActionResources.ps1 -Action out_of_box_poll

	# To build just one Action along with its setup (npm install)
	powershell -File BuildActionResources.ps1 -Action out_of_box_poll -Setup

	# To build multiple Actions
	powershell -File BuildActionResources.ps1 -Actions out_of_box_poll,out_of_box_survey,out_of_box_checklist

	# To build any subset of above
	powershell -File BuildActionResources.ps1 -Action out_of_box_poll -Setup

	# To build anything with instant inner-loop add -WatchMode
	powershell -File BuildActionResources.ps1 -ActionHost -WatchMode
	powershell -File BuildActionResources.ps1 -Action out_of_box_poll -Setup -WatchMode
	")
    Exit
}

# Get branch root
$root = git rev-parse --show-toplevel

# Install yarn if not done already
. $root\src\scripts\InstallNpmTool.ps1
InstallNpmTool "yarn" "1.22.0"

$StartDate = Get-Date

# Get ActionResources scripts root
$actionResourcesScriptRoot = "$root\src\KaizalaAggregationService\ActionResources\Scripts"

# Setup common stuffs
if ($All -or $Setup) {
    . $actionResourcesScriptRoot\SetupActionCommon.ps1

    # Setup ActionCommon
    SetupActionCommon

    # Setup ActionSDK
    SetupActionSDK
}

# Setup/Build ActionHost
if ($All -or $ActionHost) {
    . $actionResourcesScriptRoot\BuildActionHost.ps1
	
    # Setup ActionHost
    if ($All -or $Setup) {
        SetupActionHost
    }
	
    # Build ActionHost
    BuildActionHost -WatchMode:$WatchMode
}

# Setup/Build Action packages
if ($All) {
    # Add new package ids here, like 
    # $Actions = @("id1", "id2", "id3")
    $Actions = @("out_of_box_poll", "out_of_box_survey", "out_of_box_checklist", "out_of_box_checkin")
} elseif ($Action) {
    $Actions = @($Action)
} elseif ($Actions) {
    $Actions = $Actions -split ","
}

if ($Actions) {
    . $actionResourcesScriptRoot\BuildActionPackage.ps1
    if ($All -or $Setup) {
        SetupActionPackage
    }
    foreach ($action in $Actions) {
        BuildActionPackage $action -WatchMode:$WatchMode
    }
}

# Linting is not required in deployment VSO build pipelines
if (!$NoLint) {
    # Linting All ts/tsx files
    . $actionResourcesScriptRoot\Lint.ps1
    if ($All -or $Setup) {
        SetupLint
    }
    StartLint -WatchMode:$WatchMode
}

# PackageRoot updates are not required in deployment VSO build pipelines
if (!$NoPackageRootUpdate -and $All) {
    $wwwroot = "$root\src\KaizalaAggregationService\KasWeb\wwwroot"
    $packageRoots = @(
        "$root\src\KaizalaAggregationService\KasWeb\PackageRoot\Data\1.0.1119.700",
        "$root\src\KaizalaAggregationService\KasWorker\PackageRoot\Data\1.0.1119.700",
        "$root\src\KaizalaAggregationService\JobWorker\PackageRoot\Data\1.0.1119.700",
        "$root\src\KaizalaAggregationService\TeamsConnector\TeamsConnectorWorker\PackageRoot\Data\1.0.1119.700"
    )
    foreach ($packageRoot in $packageRoots) {
        "Cleaning $packageRoot..."
        Remove-Item $packageRoot -Recurse -ErrorAction SilentlyContinue
        "Updating $packageRoot..."
        New-Item -Path $packageRoot -ItemType Directory -Force 
        Copy-Item -Path "$wwwroot\*" -Destination $packageRoot -Recurse
    }
}

# All node_moduels must be cleaned up before CredScan/TSLint tasks in VSO pipeline
if ($CleanupNodeModules) {
    $actionResourcesRoot = "$root\src\KaizalaAggregationService\ActionResources"

    "Removing ActionCommon node_modules..."
    Remove-Item $actionResourcesRoot\ActionCommon\node_modules -Recurse -ErrorAction SilentlyContinue

    "Removing ActionSDK node_modules..."
    Remove-Item $actionResourcesRoot\ActionSDK\node_modules -Recurse -ErrorAction SilentlyContinue

    "Removing ActionHost node_modules..."
    Remove-Item $actionResourcesRoot\ActionHost\node_modules -Recurse -ErrorAction SilentlyContinue

    "Removing ActionPackages node_modules..."
    Remove-Item $actionResourcesRoot\ActionPackages\node_modules -Recurse -ErrorAction SilentlyContinue

    "Removing TSlint node_modules..."
    Remove-Item $actionResourcesRoot\TSlint\node_modules -Recurse -ErrorAction SilentlyContinue
}

Set-Location $root

"Time to generate Action resources: $(New-TimeSpan –Start $StartDate –End (Get-Date)) ms"