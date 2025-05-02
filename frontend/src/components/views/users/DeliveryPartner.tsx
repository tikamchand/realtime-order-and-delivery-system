import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { IUser } from "../../../utils/types";
import { Card, Empty, Typography } from "antd";

const { Text } = Typography;

const DeliveryPartner = () => {
  const [deliveryPartner, setDeliveryPartner] = useState<IUser[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest<{ data: Array<IUser> }>(
          "GET",
          "/auth/delivery-partner",
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setDeliveryPartner(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1>Delivery Partners</h1>
      <div style={{ padding: 16 }}>
        {deliveryPartner.length === 0 ? (
          <Empty description="No Delivery Partners" />
        ) : (
          deliveryPartner.map((partner) => (
            <Card
              key={partner._id}
              title={partner.name}
              style={{ marginBottom: 16 }}
            >
              <p>
                <Text strong>Email:</Text> {partner.email}
              </p>
              <p>
                <Text strong>ID:</Text> {partner._id}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryPartner;
