// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import CountUp from "react-countup";


// const Widgets = () => {
//   const [retailersDetails, setRetailersDetails] = useState([]);


//   useEffect(() => {
//     const storedData = localStorage.getItem("retailersData");
//     if (storedData) {
//       try {
//         const parsedData = JSON.parse(storedData);
//         const allData = Array.isArray(parsedData.data) ? parsedData.data : [];


//         // ✅ Total Retailers
//         const totalRetailers = allData.length;


//         // ✅ Onboarded - Key Pending (policyNotAssign === "true")
//         const keyPendingCount = allData.filter(
//           (item) => String(item.policyNotAssign).toLowerCase() === "true"
//         ).length;


//         // ✅ Low Balance Alerts (smartPolicy <= 5 OR regularPolicy <= 5)
//         const lowBalanceCount = allData.filter((item) => {
//           const smartCondition =
//             item.smartPolicy !== null &&
//             item.smartPolicy !== undefined &&
//             Number(item.smartPolicy) <= 5;


//           const regularCondition =
//             item.regularPolicy !== null &&
//             item.regularPolicy !== undefined &&
//             Number(item.regularPolicy) <= 5;


//           return smartCondition || regularCondition;
//         }).length;


//         // ✅ Reconnect Required (lastConnectDate older than 7 days)
//         const reconnectRequiredCount = allData.filter((item) => {
//           if (!item.lastConnectDate) return false;
//           const lastConnect = new Date(item.lastConnectDate);
//           const today = new Date();
//           const diffDays = (today - lastConnect) / (1000 * 60 * 60 * 24);
//           return diffDays >= 7;
//         }).length;


//         // ✅ Enterprise Not Created (EnterpriseStatus = "Enterprise ID Not Present")
//         const enterpriseNotCreatedCount = allData.filter(
//           (item) =>
//             String(item.EnterpriseStatus).toLowerCase() ===
//             "enterprise id not present".toLowerCase()
//         ).length;


//         // ✅ First Call Pending (welcome call pending)
//         const firstCallPendingCount = allData.filter(
//           (item) =>
//             (!item.welcomeRetailerDate || item.welcomeRetailerDate.trim() === "") &&
//             (!item.welcomeRetailerByName || item.welcomeRetailerByName.trim() === "")
//         ).length;


//         // ✅ Not Activated Accounts (smartPolicy === 0 AND regularPolicy === 0)
//         const notActivatedCount = allData.filter(
//           (item) =>
//             Number(item.smartPolicy) === 0 && Number(item.regularPolicy) === 0
//         ).length;


//         console.log("All Retailers:", allData);
//         console.log("Not Activated Accounts:", notActivatedCount);


//         // 🔹 Build the details dynamically
//         setRetailersDetails([
//           {
//             id: 1,
//             label: "Total Retailers",
//             badge: "ri-group-line text-primary",
//             icon: "ri-store-2-line",
//             counter: totalRetailers,
//             decimals: 0,
//             suffix: "",
//             prefix: "",
//             link: "/all-monitor-retailers",
//           },
//           {
//             id: 2,
//             label: "Onboarded - Key Pending",
//             badge: "ri-time-line text-warning",
//             icon: "ri-clipboard-line",
//             counter: keyPendingCount,
//             decimals: 0,
//             suffix: "",
//             prefix: "",
//             link: "/manage-onboard-key-pending",
//           },
//           {
//             id: 3,
//             label: "Low Balance Alerts",
//             badge: "ri-error-warning-line text-danger",
//             icon: "ri-wallet-3-line",
//             counter: lowBalanceCount,
//             decimals: 0,
//             suffix: "",
//             prefix: "",
//             link: "/manage-low-balance-alerts",
//           },
//           {
//             id: 4,
//             label: "Not Activated Accounts",
//             badge: "ri-forbid-2-line text-secondary",
//             icon: "ri-user-unfollow-line",
//             counter: notActivatedCount, // ✅ dynamic now
//             decimals: 0,
//             prefix: "",
//             separator: ",",
//             suffix: "",
//             link: "/manage-not-activated-accounts",
//           },
//           {
//             id: 5,
//             label: "Reconnect Required",
//             badge: "ri-refresh-line text-info",
//             icon: "ri-link-unlink-m",
//             counter: reconnectRequiredCount,
//             decimals: 0,
//             separator: ",",
//             suffix: "",
//             prefix: "",
//             link: "/manage-reconnect-required",
//           },
//           {
//             id: 6,
//             label: "Enterprise Not Created",
//             badge: "ri-refresh-line text-info",
//             icon: "ri-link-unlink-m",
//             counter: enterpriseNotCreatedCount,
//             decimals: 0,
//             separator: ",",
//             suffix: "",
//             prefix: "",
//             link: "/manage-not-ready-enterprises",
//           },
//           {
//             id: 7,
//             label: "First Call Pending",
//             badge: "ri-refresh-line text-info",
//             icon: "ri-link-unlink-m",
//             counter: firstCallPendingCount,
//             decimals: 0,
//             separator: ",",
//             suffix: "",
//             prefix: "",
//             link: "/first-call-pending",
//           },
//           {
//             id: 8,
//             label: "Not Using (last customer register date)",
//             badge: "ri-refresh-line text-info",
//             icon: "ri-link-unlink-m",
//             counter: 8,
//             decimals: 0,
//             separator: ",",
//             suffix: "",
//             prefix: "",
//             link: "/not-using",
//           },
//         ]);
//       } catch (error) {
//         console.error("Error parsing localStorage data:", error);
//       }
//     }
//   }, []);


//   return (
//     <div className="col-xl-12">
//       <div className="card crm-widget">
//         <div className="card-body p-0">
//           <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 g-0">
//             {retailersDetails.map((widget) => (
//               <div className="col" key={widget.id}>
//                 <Link
//                   to={widget.link}
//                   className="text-decoration-none text-dark"
//                 >
//                   <div className="py-4 px-3 card-hover">
//                     <h5 className="text-muted text-uppercase fs-13">
//                       {widget.label}
//                       <i
//                         className={widget.badge + " fs-18 float-end align-middle"}
//                       ></i>
//                     </h5>
//                     <div className="d-flex align-items-center">
//                       <div className="flex-shrink-0">
//                         <i className={widget.icon + " display-6 text-muted"}></i>
//                       </div>
//                       <div className="flex-grow-1 ms-3">
//                         <h2 className="mb-0">
//                           <CountUp
//                             start={0}
//                             prefix={widget.prefix}
//                             suffix={widget.suffix}
//                             separator={widget.separator}
//                             end={widget.counter}
//                             decimals={widget.decimals}
//                             duration={4}
//                           />
//                         </h2>
//                       </div>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Widgets;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CountUp from "react-countup";

const Widgets = () => {
  const [retailersDetails, setRetailersDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const response = await fetch(
          "https://goelectronix.in/api/v1/get-allretailers?page=1&per_page=10000"
        );
        const result = await response.json();

        // ✅ Ensure we have an array of data
        const allData = Array.isArray(result.data) ? result.data : [];

        // ✅ Total Retailers
        const totalRetailers = allData.length;

        // ✅ Onboarded - Key Pending
        const keyPendingCount = allData.filter(
          (item) => String(item.policyNotAssign).toLowerCase() === "true"
        ).length;

        // ✅ Low Balance Alerts
        const lowBalanceCount = allData.filter((item) => {
          const smartCondition =
            item.smartPolicy !== null &&
            item.smartPolicy !== undefined &&
            Number(item.smartPolicy) <= 5;

          const regularCondition =
            item.regularPolicy !== null &&
            item.regularPolicy !== undefined &&
            Number(item.regularPolicy) <= 5;

          return smartCondition || regularCondition;
        }).length;

        // ✅ Reconnect Required
        const reconnectRequiredCount = allData.filter((item) => {
          if (!item.lastConnectDate) return false;
          const lastConnect = new Date(item.lastConnectDate);
          const today = new Date();
          const diffDays = (today - lastConnect) / (1000 * 60 * 60 * 24);
          return diffDays >= 7;
        }).length;

        // ✅ Enterprise Not Created
        const enterpriseNotCreatedCount = allData.filter(
          (item) =>
            String(item.EnterpriseStatus).toLowerCase() ===
            "enterprise id not present".toLowerCase()
        ).length;

        // ✅ First Call Pending
        const firstCallPendingCount = allData.filter(
          (item) =>
            (!item.welcomeRetailerDate || item.welcomeRetailerDate.trim() === "") &&
            (!item.welcomeRetailerByName || item.welcomeRetailerByName.trim() === "")
        ).length;

        // ✅ Not Activated Accounts
        const notActivatedCount = allData.filter(
          (item) =>
            Number(item.smartPolicy) === 0 && Number(item.regularPolicy) === 0
        ).length;

        // ✅ Build details
        setRetailersDetails([
          {
            id: 1,
            label: "Total Retailers",
            badge: "ri-group-line text-primary",
            icon: "ri-store-2-line",
            counter: totalRetailers,
            link: "/all-monitor-retailers",
          },
          {
            id: 2,
            label: "Onboarded - Key Pending",
            badge: "ri-time-line text-warning",
            icon: "ri-clipboard-line",
            counter: keyPendingCount,
            link: "/manage-onboard-key-pending",
          },
          {
            id: 3,
            label: "Low Balance Alerts",
            badge: "ri-error-warning-line text-danger",
            icon: "ri-wallet-3-line",
            counter: lowBalanceCount,
            link: "/manage-low-balance-alerts",
          },
          {
            id: 4,
            label: "Not Activated Accounts",
            badge: "ri-forbid-2-line text-secondary",
            icon: "ri-user-unfollow-line",
            counter: notActivatedCount,
            link: "/manage-not-activated-accounts",
          },
          {
            id: 5,
            label: "Reconnect Required",
            badge: "ri-refresh-line text-info",
            icon: "ri-link-unlink-m",
            counter: reconnectRequiredCount,
            link: "/manage-reconnect-required",
          },
          {
            id: 6,
            label: "Enterprise Not Created",
            badge: "ri-refresh-line text-info",
            icon: "ri-link-unlink-m",
            counter: enterpriseNotCreatedCount,
            link: "/manage-not-ready-enterprises",
          },
          {
            id: 7,
            label: "First Call Pending",
            badge: "ri-refresh-line text-info",
            icon: "ri-link-unlink-m",
            counter: firstCallPendingCount,
            link: "/first-call-pending",
          },
          {
            id: 8,
            label: "Not Using (last customer register date)",
            badge: "ri-refresh-line text-info",
            icon: "ri-link-unlink-m",
            counter: 8, // 🔹 still placeholder
            link: "/not-using",
          },
        ]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRetailers();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="col-xl-12">
      <div className="card crm-widget">
        <div className="card-body p-0">
          <div className="row row-cols-xxl-4 row-cols-md-2 row-cols-1 g-0">
            {retailersDetails.map((widget) => (
              <div className="col" key={widget.id}>
                <Link
                  to={widget.link}
                  className="text-decoration-none text-dark"
                >
                  <div className="py-4 px-3 card-hover">
                    <h5 className="text-muted text-uppercase fs-13">
                      {widget.label}
                      <i
                        className={widget.badge + " fs-18 float-end align-middle"}
                      ></i>
                    </h5>
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <i className={widget.icon + " display-6 text-muted"}></i>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h2 className="mb-0">
                          <CountUp
                            start={0}
                            end={widget.counter}
                            duration={3}
                          />
                        </h2>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
