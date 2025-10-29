import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import Asset from "../../../../models/Asset";
import User from "../../../../models/User";
import { redirect, notFound } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import DownloadPDFButton from "./DownloadPDFButton";

export default async function AssetDetailPage({ params }) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const asset = await Asset.findById(params.id).lean();

  if (!asset) {
    notFound();
  }

  // Get user names for owners
  const ownerIds = asset.owners?.map(o => o.personId).filter(Boolean) || [];
  const users = await User.find({ _id: { $in: ownerIds } }).lean();
  const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));

  // Serialize asset data
  const assetData = {
    _id: asset._id.toString(),
    assetType: asset.assetType,
    title: asset.title,
    nickname: asset.nickname,
    description: asset.description,
    landUseType: asset.landUseType,
    houseUsageType: asset.houseUsageType,
    apartmentUsageType: asset.apartmentUsageType,
    vehicleType: asset.vehicleType,
    possessionStatus: asset.possessionStatus,
    isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence,
    isIncomeGenerating: asset.isIncomeGenerating,
    currentStatus: asset.currentStatus,
    location: asset.location,
    dimensions: asset.dimensions,
    structure: asset.structure,
    registration: asset.registration,
    specs: asset.specs,
    owners: asset.owners?.map(o => {
      const userId = o.personId?.toString();
      const user = userMap[userId];
      return {
        personName: user?.fullName || "Unknown",
        percentage: o.percentage,
        ownershipType: o.ownershipType,
      };
    }) || [],
    acquisitionInfo: asset.acquisitionInfo,
    mutationAndTitle: asset.mutationAndTitle,
    occupancy: asset.occupancy,
    rentalInfo: asset.rentalInfo,
    valuation: asset.valuation,
    compliance: asset.compliance,
    possessionDetails: asset.possessionDetails,
    maintenance: asset.maintenance,
    controlInfo: asset.controlInfo,
    history: asset.history || [],
    flags: asset.flags,
    notesInternal: asset.notesInternal,
    tags: asset.tags || [],
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };

  return (
    <DashboardLayout userName={user.fullName}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ margin: 0 }}>{assetData.title}</h1>
        <DownloadPDFButton asset={assetData} />
      </div>

      <div className="card">
        <h2>Basic Information</h2>
        <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
          <div><strong>Type:</strong> {asset.assetType.replace("_", " ")}</div>
          <div><strong>Status:</strong> {asset.currentStatus}</div>
          {asset.description && <div><strong>Description:</strong> {asset.description}</div>}
        </div>
      </div>

      {(asset.location?.city || asset.location?.areaOrSector) && (
        <div className="card">
          <h2>Location</h2>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            {asset.location.country && <div><strong>Country:</strong> {asset.location.country}</div>}
            {asset.location.city && <div><strong>City:</strong> {asset.location.city}</div>}
            {asset.location.areaOrSector && <div><strong>Area/Sector:</strong> {asset.location.areaOrSector}</div>}
            {asset.location.addressDetails && <div><strong>Address:</strong> {asset.location.addressDetails}</div>}
          </div>
        </div>
      )}

      <div className="card">
        <h2>Ownership</h2>
        <div className="table-responsive">
          <table className="table-sm table-nowrap">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Percentage</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {asset.owners.map((owner, idx) => (
                <tr key={idx}>
                  <td>{owner.personId?.fullName || "Unknown"}</td>
                  <td>{owner.percentage}%</td>
                  <td>{owner.ownershipType || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {asset.acquisitionInfo?.method && (
        <div className="card">
          <h2>Acquisition Information</h2>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            <div><strong>Method:</strong> {asset.acquisitionInfo.method}</div>
            {asset.acquisitionInfo.acquiredDate && (
              <div><strong>Date:</strong> {new Date(asset.acquisitionInfo.acquiredDate).toLocaleDateString()}</div>
            )}
            {asset.acquisitionInfo.acquiredFrom && (
              <div><strong>Acquired From:</strong> {asset.acquisitionInfo.acquiredFrom}</div>
            )}
            {asset.acquisitionInfo.priceOrValueAtAcquisition && (
              <div><strong>Value:</strong> {asset.acquisitionInfo.priceOrValueAtAcquisition}</div>
            )}
            {asset.acquisitionInfo.notes && (
              <div><strong>Notes:</strong> {asset.acquisitionInfo.notes}</div>
            )}
          </div>
        </div>
      )}

      {asset.disputeInfo?.isInDispute && (
        <div className="card" style={{ borderLeft: "4px solid #d32f2f" }}>
          <h2 style={{ color: "#d32f2f" }}>Dispute Information</h2>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "1rem" }}>
            {asset.disputeInfo.type && <div><strong>Type:</strong> {asset.disputeInfo.type}</div>}
            {asset.disputeInfo.startedDate && (
              <div><strong>Started:</strong> {new Date(asset.disputeInfo.startedDate).toLocaleDateString()}</div>
            )}
            {asset.disputeInfo.details && <div><strong>Details:</strong> {asset.disputeInfo.details}</div>}
            {asset.disputeInfo.lawyerName && <div><strong>Lawyer:</strong> {asset.disputeInfo.lawyerName}</div>}
            {asset.disputeInfo.caseNumber && <div><strong>Case Number:</strong> {asset.disputeInfo.caseNumber}</div>}
            {asset.disputeInfo.nextHearingDate && (
              <div><strong>Next Hearing:</strong> {new Date(asset.disputeInfo.nextHearingDate).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      )}

      {/* Documents table */}
      {asset.documents && asset.documents.length > 0 && (
        <div className="card">
          <h2>Documents</h2>
          <div className="table-responsive">
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Label</th>
                  <th>File</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>
                {asset.documents.map((doc, idx) => (
                  <tr key={idx}>
                    <td>{doc.label}</td>
                    <td><a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">View</a></td>
                    <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {asset.history && asset.history.length > 0 && (
        <div className="card">
          <h2>History</h2>
          <div style={{ marginTop: "1rem" }}>
            {asset.history.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
                <div><strong>{new Date(entry.date).toLocaleDateString()}</strong> - {entry.action}</div>
                {entry.details && <div style={{ color: "#666", marginTop: "0.25rem" }}>{entry.details}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {asset.tags && asset.tags.length > 0 && (
        <div className="card">
          <h2>Tags</h2>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
            {asset.tags.map((tag, idx) => (
              <span key={idx} style={{ padding: "0.25rem 0.75rem", background: "#e3f2fd", borderRadius: "16px", fontSize: "0.875rem" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}