import {Button, Row, Table, Tag, Typography} from "antd";
import {CredentialsProps} from "../App";
import {remove, toggleAwsCredentials} from "../services/httpRequests";
import {MdChangeCircle} from "react-icons/md";
import useToast from "./toastHook";

export default function TableComponent({
  data,
  currentCredential,
  refetch,
  refetchCurrentStage,
  isHidden,
}: {
  data: CredentialsProps[] | undefined;
  currentCredential: string | undefined;
  refetch: () => void;
  refetchCurrentStage: () => void;
  isHidden: boolean;
}) {
  const {showToast} = useToast();

  return (
    <Table
      rowKey={x => x.accessKeyId}
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
                  {currentCredential &&
                    rec?.stage === currentCredential?.trim() && (
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
              <Row style={{gap: 10}}>
                <Button
                  title="alterar"
                  onClick={async () => {
                    await toggleAwsCredentials(rec).then(() => {
                      refetchCurrentStage();
                      showToast({
                        color: "green",
                        text: `Stage alterado para: ${rec?.stage}`,
                      });
                    });
                  }}
                >
                  <MdChangeCircle size={20} color="green"></MdChangeCircle>
                </Button>
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
              </Row>
            );
          },
        },
      ]}
    ></Table>
  );
}
