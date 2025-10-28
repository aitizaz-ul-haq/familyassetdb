"use client";

import PlotAssetEditForm from "./PlotAssetEditForm";
import HouseAssetEditForm from "./HouseAssetEditForm";
import ApartmentAssetEditForm from "./ApartmentAssetEditForm";
import VehicleAssetEditForm from "./VehicleAssetEditForm";

export default function AssetEditModal({ asset, onClose }) {
  switch (asset.assetType) {
    case "land_plot":
      return <PlotAssetEditForm asset={asset} onClose={onClose} />;
    case "house":
      return <HouseAssetEditForm asset={asset} onClose={onClose} />;
    case "apartment":
      return <ApartmentAssetEditForm asset={asset} onClose={onClose} />;
    case "vehicle":
      return <VehicleAssetEditForm asset={asset} onClose={onClose} />;
    default:
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>Edit form for {asset.assetType} is not yet implemented.</p>
          <button onClick={onClose}>Close</button>
        </div>
      );
  }
}
