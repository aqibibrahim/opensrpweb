import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useLocation } from 'react-router';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  LOCATION_UNIT_GROUP_ALL,
  ADD_LOCATION_UNIT,
  EDIT_LOCATION_UNIT,
  LOCATION_UNIT_EXTRAFIELDS,
  LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER,
  ERROR_OCCURED,
} from '../../constants';
import {
  ExtraField,
  fetchLocationUnits,
  getLocationUnitsArray,
  LocationUnit,
  LocationUnitStatus,
  locationUnitsReducerName,
  locationUnitsReducer,
} from '../../ducks/location-units';
import { useDispatch, useSelector } from 'react-redux';
import Form, { FormField, Props } from './Form';
import { Row, Col, Spin } from 'antd';
import {
  LocationUnitGroup,
  reducerName as LocationUnitGroupsReducerName,
  reducer as LocationUnitGroupsReducer,
} from '../../ducks/location-unit-groups';
import reducerRegistry from '@onaio/redux-reducer-registry';
import {
  getAllHierarchiesArray,
  fetchAllHierarchies,
  reducer as locationHierarchyReducer,
  reducerName as locationHierarchyReducerName,
} from '../../ducks/location-hierarchy';
import { sendErrorNotification } from '@opensrp/notifications';
import './LocationUnitAddEdit.css';
import {
  generateJurisdictionTree,
  getBaseTreeNode,
  getHierarchy,
} from '../../ducks/locationHierarchy/utils';

reducerRegistry.register(LocationUnitGroupsReducerName, LocationUnitGroupsReducer);
reducerRegistry.register(locationUnitsReducerName, locationUnitsReducer);
reducerRegistry.register(locationHierarchyReducerName, locationHierarchyReducer);

export const LocationUnitAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const locationUnits = useSelector((state) => getLocationUnitsArray(state));
  const [locationUnitGroup, setLocationUnitGroup] = useState<LocationUnitGroup[]>([]);
  const treeData = useSelector((state) => getAllHierarchiesArray(state));
  const [extrafields, setExtrafields] = useState<ExtraField[] | null>(null);
  const [LocationUnitDetail, setLocationUnitDetail] = useState<FormField | undefined>(undefined);
  const { opensrpBaseURL } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const parentId = query.get('parentId');

  useEffect(() => {
    if (parentId != null)
      setLocationUnitDetail({
        name: '',
        status: LocationUnitStatus.ACTIVE,
        type: '',
        parentId: parentId,
      });
  }, [parentId]);

  useEffect(() => {
    if (params.id) {
      const serve = new OpenSRPService(
        `location/${params.id}?is_jurisdiction=true`,
        opensrpBaseURL
      );
      serve
        .list()
        .then((response: LocationUnit) => {
          setLocationUnitDetail({
            ...response.properties,
            locationTags: response.locationTags?.map((loc) => loc.id),
            geometry: JSON.stringify(response.geometry),
            type: response.type,
          });
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [params.id, opensrpBaseURL]);

  useEffect(() => {
    if (!locationUnitGroup.length) {
      const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, opensrpBaseURL);
      serve
        .list()
        .then((response: LocationUnitGroup[]) => setLocationUnitGroup(response))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnitGroup.length, opensrpBaseURL]);

  useEffect(() => {
    if (!locationUnits.length) {
      getBaseTreeNode(opensrpBaseURL)
        .then((response) => dispatch(fetchLocationUnits(response)))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [locationUnits.length, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (!treeData.length && locationUnits.length) {
      getHierarchy(locationUnits, opensrpBaseURL)
        .then((hierarchy) => {
          const allhierarchy = hierarchy.map((hier) => generateJurisdictionTree(hier).model);
          dispatch(fetchAllHierarchies(allhierarchy));
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
    // to avoid extra rerenders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationUnits.length, treeData.length, dispatch, opensrpBaseURL]);

  useEffect(() => {
    if (!extrafields && locationUnitGroup.length && treeData.length) {
      const serve = new OpenSRPService(
        LOCATION_UNIT_EXTRAFIELDS + `&identifier=${LOCATION_UNIT_EXTRAFIELDS_IDENTIFIER}`,
        opensrpBaseURL
      );
      serve
        .list()
        .then((response: ExtraField[]) => setExtrafields(response))
        .catch(() => sendErrorNotification(ERROR_OCCURED));
    }
  }, [extrafields, locationUnitGroup.length, treeData.length, opensrpBaseURL]);

  if (
    extrafields === null ||
    !locationUnitGroup.length ||
    !treeData.length ||
    (params.id && !LocationUnitDetail?.name)
  )
    return <Spin size={'large'} />;

  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? EDIT_LOCATION_UNIT : ADD_LOCATION_UNIT}</title>
      </Helmet>

      <h5 className="mb-4 header-title">
        {params.id ? `${EDIT_LOCATION_UNIT} | ${LocationUnitDetail?.name}` : ADD_LOCATION_UNIT}
      </h5>

      <Col className="bg-white p-4" span={24}>
        <Form
          extraFields={extrafields}
          opensrpBaseURL={opensrpBaseURL}
          treedata={treeData}
          id={params.id}
          locationUnitGroup={locationUnitGroup}
          initialValue={LocationUnitDetail}
        />
      </Col>
    </Row>
  );
};

export default LocationUnitAddEdit;
