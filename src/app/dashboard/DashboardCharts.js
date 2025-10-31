"use client";

import styles from "./dashboard.module.css";

export default function DashboardCharts({ data }) {
  const colors = {
    primary: ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"],
    status: {
      clean: "#4caf50",
      in_dispute: "#f44336",
      under_transfer: "#ff9800",
      sold_but_not_cleared: "#9c27b0",
      unknown: "#9e9e9e",
    },
  };

  return (
    <div className={styles.chartsGrid}>
      {/* Row 1: Assets by Type & Status */}
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>📊 Assets by Type</h2>
          <div className={styles.barChartContainer}>
            {data.assetsByType.map((item, idx) => {
              const maxCount = Math.max(
                ...data.assetsByType.map((d) => d.count)
              );
              const percentage = (item.count / maxCount) * 100;

              return (
                <div key={idx} className={styles.barItem}>
                  <div className={styles.barHeader}>
                    <span className={styles.barLabel}>
                      {item.type.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span
                      className={styles.barValue}
                      style={{
                        color: colors.primary[idx % colors.primary.length],
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{
                        width: `${percentage}%`,
                        background: colors.primary[idx % colors.primary.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>🎯 Assets by Status</h2>
          <div className={styles.statusList}>
            {data.assetsByStatus.map((item, idx) => (
              <div key={idx} className={styles.statusItem}>
                <div
                  className={styles.statusBadge}
                  style={{
                    background: colors.status[item.status] || "#9e9e9e",
                  }}
                >
                  {item.count}
                </div>
                <div className={styles.statusInfo}>
                  <div className={styles.statusName}>
                    {item.status.replace(/_/g, " ").toUpperCase()}
                  </div>
                  <div className={styles.statusPercentage}>
                    {Math.round(
                      (item.count /
                        data.assetsByStatus.reduce(
                          (sum, d) => sum + d.count,
                          0
                        )) *
                        100
                    )}
                    % of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Top Cities & Documentation Status */}
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>📍 Top 5 Cities</h2>
          <div className={styles.citiesList}>
            {data.assetsByCity.map((item, idx) => (
              <div
                key={idx}
                className={styles.cityItem}
                style={{
                  background: `linear-gradient(90deg, ${colors.primary[idx]} 0%, ${colors.primary[idx]}22 100%)`,
                  borderColor: colors.primary[idx],
                }}
              >
                <div
                  className={styles.cityRank}
                  style={{ color: colors.primary[idx] }}
                >
                  #{idx + 1}
                </div>
                <div className={styles.cityName}>{item.city}</div>
                <div
                  className={styles.cityCount}
                  style={{ color: colors.primary[idx] }}
                >
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>📎 Documentation Status</h2>
          <div className={styles.donutContainer}>
            <div className={styles.donutChart}>
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="20"
                  strokeDasharray={`${
                    (data.documentsStats.withDocs /
                      (data.documentsStats.withDocs +
                        data.documentsStats.withoutDocs)) *
                    251.2
                  } 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className={styles.donutCenter}>
                <div className={styles.donutNumber}>
                  {data.documentsStats.withDocs}
                </div>
                <div className={styles.donutLabel}>with docs</div>
              </div>
            </div>

            <div className={styles.donutLegend}>
              <div className={styles.legendItem}>
                <div
                  className={styles.legendColor}
                  style={{ background: "#4caf50" }}
                />
                <span className={styles.legendText}>With Documents</span>
                <span
                  className={styles.legendValue}
                  style={{ color: "#4caf50" }}
                >
                  {data.documentsStats.withDocs}
                </span>
              </div>
              <div className={styles.legendItem}>
                <div
                  className={styles.legendColor}
                  style={{ background: "#f0f0f0" }}
                />
                <span className={styles.legendText}>Without Documents</span>
                <span className={styles.legendValue} style={{ color: "#999" }}>
                  {data.documentsStats.withoutDocs}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Top Owners & Acquisition Trend */}
      <div className={styles.chartRow}>
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>👑 Top 5 Asset Owners</h2>
          <div className={styles.ownersList}>
            {data.topOwners.map((item, idx) => {
              const maxCount = Math.max(...data.topOwners.map((d) => d.count));
              const percentage = (item.count / maxCount) * 100;

              return (
                <div
                  key={idx}
                  className={styles.ownerItem}
                  style={{ borderLeftColor: colors.primary[idx] }}
                >
                  <div className={styles.ownerHeader}>
                    <span className={styles.ownerName}>{item.name}</span>
                    <span
                      className={styles.ownerCount}
                      style={{ color: colors.primary[idx] }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div className={styles.ownerBarTrack}>
                    <div
                      className={styles.ownerBarFill}
                      style={{
                        width: `${percentage}%`,
                        background: colors.primary[idx],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            📈 Acquisition Trend (Last 6 Months)
          </h2>
          {data.acquisitionTrend.length > 0 ? (
            <div className={styles.trendChart}>
              {data.acquisitionTrend.map((item, idx) => {
                const maxCount = Math.max(
                  ...data.acquisitionTrend.map((d) => d.count),
                  1
                );
                const heightPercentage = (item.count / maxCount) * 100;

                return (
                  <div key={idx} className={styles.trendBar}>
                    <div
                      className={styles.trendBarFill}
                      style={{
                        height: `${Math.max(heightPercentage, 10)}%`,
                        background: `linear-gradient(to top, ${
                          colors.primary[idx % colors.primary.length]
                        }, ${
                          colors.primary[(idx + 1) % colors.primary.length]
                        })`,
                      }}
                    >
                      <span className={styles.trendValue}>{item.count}</span>
                    </div>
                    <div className={styles.trendLabel}>
                      {new Date(item.month + "-01").toLocaleDateString(
                        "en-US",
                        { month: "short" }
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No acquisition data available for the last 6 months</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
