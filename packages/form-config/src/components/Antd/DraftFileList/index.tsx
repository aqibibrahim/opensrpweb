import React, { useState, useEffect, ChangeEvent } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Card, Typography, Spin, Table, Space, Button, Divider, Input } from 'antd';
import { getAccessToken } from '@onaio/session-reducer';
import { SettingOutlined, UploadOutlined, SearchOutlined } from '@ant-design/icons';
import DraftFilesReducer, {
  fetchManifestDraftFiles,
  draftReducerName,
  getAllManifestDraftFilesArray,
  removeManifestDraftFiles,
} from '../../../ducks/manifestDraftFiles';
import { getFetchOptions, OpenSRPService } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { useSelector, useDispatch } from 'react-redux';
import { ManifestFilesTypes } from '../../../ducks/manifestFiles';
import { useHistory, Redirect } from 'react-router';
import { OPENSRP_FORM_METADATA_ENDPOINT, ERROR_OCCURRED } from '../../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { getTableColumns, makeRelease } from './utils';

/** Register reducer */
reducerRegistry.register(draftReducerName, DraftFilesReducer);

/** interface for component props */
export interface DraftFileListProps {
  opensrpBaseURL: string;
  removeDraftFiles: typeof removeManifestDraftFiles;
  fetchDraftFiles: typeof fetchManifestDraftFiles;
  uploadFileURL: string;
  onMakeReleaseRedirectURL: string;
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultProps: DraftFileListProps = {
  opensrpBaseURL: '',
  uploadFileURL: '',
  onMakeReleaseRedirectURL: '',
  removeDraftFiles: removeManifestDraftFiles,
  fetchDraftFiles: fetchManifestDraftFiles,
};

const DrafFileList = (props: DraftFileListProps): JSX.Element => {
  const { Title } = Typography;
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [sortedInfo, setSortedInfo] = useState<Dictionary>();
  const [ifDoneHere, setIfDoneHere] = useState(false);
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const data: ManifestFilesTypes[] = useSelector((state) => getAllManifestDraftFilesArray(state));
  const [filterData, setfilterDataData] = useState<ManifestFilesTypes[] | null>(null);
  const [value, setValue] = useState('');
  data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const {
    opensrpBaseURL,
    customFetchOptions,
    fetchDraftFiles,
    uploadFileURL,
    onMakeReleaseRedirectURL,
    removeDraftFiles,
  } = props;

  useEffect(() => {
    /** get manifest Draftfiles */
    setLoading(true);
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    const params = { is_draft: true };
    const clientService = new OpenSRPService(
      accessToken,
      opensrpBaseURL,
      OPENSRP_FORM_METADATA_ENDPOINT,
      customFetchOptions
    );
    clientService
      .list(params)
      .then((res: ManifestFilesTypes[]) => {
        dispatch(fetchDraftFiles(res));
      })
      .catch((_: Error) => {
        sendErrorNotification(ERROR_OCCURRED);
      })
      .finally(() => setLoading(false));
  }, [accessToken, opensrpBaseURL, customFetchOptions, fetchDraftFiles, dispatch]);

  if (loading) {
    return <Spin />;
  }

  if (ifDoneHere && onMakeReleaseRedirectURL) {
    return <Redirect to={onMakeReleaseRedirectURL} />;
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    setValue(searchValue);
    const filterDataedData = data.filter(
      (entry) =>
        entry.label.toLowerCase().includes(searchValue) ||
        entry.identifier.toLowerCase().includes(searchValue) ||
        (entry.module && entry.module.toUpperCase().includes(searchValue))
    );
    setfilterDataData(filterDataedData);
  };

  return (
    <div className="layout-content">
      <Title level={3}>Draft Files</Title>
      <Card>
        <Space style={{ marginBottom: 16, float: 'left' }}>
          <Input
            id="search"
            placeholder="Search"
            size="large"
            value={value}
            prefix={<SearchOutlined />}
            onChange={onChange}
          />
        </Space>
        <Space style={{ marginBottom: 16, float: 'right' }}>
          <Button type="primary" onClick={() => history.push(uploadFileURL)}>
            <UploadOutlined />
            Upload New File
          </Button>
          <Divider type="vertical" />
          <SettingOutlined />
        </Space>
        <Table
          columns={getTableColumns(
            accessToken,
            opensrpBaseURL,
            false,
            sortedInfo,
            customFetchOptions
          )}
          dataSource={value.length < 1 ? data : (filterData as ManifestFilesTypes[])}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: true,
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
          }}
          onChange={(_: Dictionary, __: Dictionary, sorter: Dictionary) => {
            setSortedInfo(sorter);
          }}
        />
        {data.length > 0 && (
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              onClick={() =>
                makeRelease(
                  data,
                  accessToken,
                  opensrpBaseURL,
                  dispatch,
                  removeDraftFiles,
                  setIfDoneHere,
                  customFetchOptions
                )
              }
            >
              Make Release
            </Button>
          </Space>
        )}
      </Card>
    </div>
  );
};

DrafFileList.defaultProps = defaultProps;

export { DrafFileList };
