import Encoder from './Encoder';
import DateHelper from '../../../DateHelper';
import {mock, MockProxy} from 'jest-mock-extended';
import Entity, {TimeRecord} from '../../Entity';
import EncodedRecord from './EncodedRecord';
import {expect} from '@jest/globals';

describe(Encoder, function () {
    let encoder: Encoder,
        dateHelper: DateHelper & MockProxy<DateHelper>;

    beforeEach(function () {
        dateHelper = mock<DateHelper>();

        encoder = new Encoder(
            {
                loadRangeEndpoint: '/api/records/?start={start}&end={end}',
                loadRecordEndpoint: '/api/record/{timestamp}',
                writeRecordEndpoint: '/api/record'
            },
            dateHelper
        );
    });

    it('should encodes endpoint for load range', async function () {
        dateHelper.toUnixTimestamp.mockReturnValueOnce(1);
        dateHelper.toUnixTimestamp.mockReturnValueOnce(2);
        const result: string = encoder.encodeRangeLoadUri(new Date(1000), new Date(2000));

        expect(dateHelper.toUnixTimestamp).toBeCalledWith(new Date(1000));
        expect(dateHelper.toUnixTimestamp).toBeCalledWith(new Date(2000));
        expect(result).toBe('/api/records/?start=1&end=2');
    });

    it('should encodes endpoint for load record', async function () {
        dateHelper.toUnixTimestamp.mockReturnValueOnce(1);
        const result: string = encoder.encodeRecordLoadUri(new Date(1000));

        expect(dateHelper.toUnixTimestamp).toBeCalledWith(new Date(1000));
        expect(result).toBe('/api/record/1');
    });

    it('should encodes endpoint for write record', async function () {
        const result: string = encoder.encodeRecordWriteUri();

        expect(result).toBe('/api/record');
    });

    it('should encode record entity', async function () {
        const timeRecord: TimeRecord = new TimeRecord();
        timeRecord.hours = 1.23;
        timeRecord.text = 'test::text:';
        const record: Entity = new Entity();
        record.date = new Date(123456789);
        record.timeRecords = [timeRecord];

        dateHelper.toUnixTimestamp.mockReturnValueOnce(123456);

        const result: EncodedRecord = encoder.encodeRecord(record);

        expect(dateHelper.toUnixTimestamp).toBeCalledWith(new Date(123456789));
        const expectedJson: EncodedRecord = {
            date: 123456,
            timeRecords: [
                {
                    hours: 1.23,
                    text: 'test::text:'
                }
            ]
        };
        expect(result).toEqual(expectedJson);
    });
});
