import {Button, Row, Table, Tag, Typography} from "antd";
import {CredentialsProps} from "../App";
import {remove} from "../services/httpRequests";

export default function TableComponent({
  data,
  currentCredential,
  refetch,
  isHidden,
}: {
  data: CredentialsProps[] | undefined;
  currentCredential: string | undefined;
  refetch: () => void;
  isHidden: boolean;
}) {
  return (
    <Table
      size="small"
      dataSource={data}
      columns={[
        {
          title: "AccessKeyId",
          dataIndex: "accessKeyId",
          render(text) {
            return (
              <Typography.Text id="hiddenKey" copyable>
                {isHidden ? "************" : text}
              </Typography.Text>
            );
          },
        },
        {
          title: "SecretKeyId",
          dataIndex: "secretKeyId",
          render(text) {
            return (
              <Typography.Text id="hiddenKey" copyable>
                {isHidden ? "************" : text}
              </Typography.Text>
            );
          },
        },

        {
          title: "Stage",
          dataIndex: "stage",
          render(text, rec) {
            return (
              <Row>
                <Tag style={{textTransform: "capitalize"}} color="blue">
                  {text}
                </Tag>
                <>
                  {currentCredential && rec?.stage === currentCredential && (
                    <Tag color="green">{"Atual"}</Tag>
                  )}
                </>
              </Row>
            );
          },
        },
        {
          title: "Ações",
          render(_, rec) {
            return (
              <>
                <Button
                  title="deletar"
                  onClick={() => remove({refetch, stage: rec.stage})}
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/fluency-systems-regular/48/trash--v1.png"
                    alt="trash--v1"
                  />
                </Button>
              </>
            );
          },
        },
      ]}
    ></Table>
  );
}
