import React, { useState } from 'react';
import { format } from 'date-fns';
import Button from '../Button';
import DatePicker from 'react-datepicker';
import { createGame } from '../../services/game-service';
import { checkDateInput } from '../../utils/checkDateInput';
import { useRouter } from 'next/router';
import InputLabel from '../InputLabel';
import { CourtRequestedDoc } from '../../pages/api/_models/court-model';
import appRoutes from '../../types/Routes';

const initialValues = {
  gameName: '',
  date: undefined,
  startTime: '',
  endTime: '',
  description: '',
};

const NAME_NAME = 'gameName';
const DATE_NAME = 'date';
const START_TIME_NAME = 'startTime';
const END_TIME_NAME = 'endTime';
const DESCRIPTION_NAME = 'description';

const GameForm: React.FC<{ court: CourtRequestedDoc }> = ({ court }) => {
  const [form, setForm] = useState(initialValues);
  const router = useRouter();
  const { gameName, startTime, date, endTime, description } = form;
  console.log({ form });

  function createStartTime() {
    return new Date(`${date}, ${startTime}`);
  }
  function createEndTime() {
    const splitEndTime = endTime.split(':');
    return new Date(createStartTime().setHours(parseInt(splitEndTime[0]), parseInt(splitEndTime[1])));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log({
      ...form,
      startTime: createStartTime(),
      endTime: createEndTime(),
      courtId: court._id,
    });
    const game = await createGame({
      ...form,
      startTime: createStartTime(),
      endTime: createEndTime(),
      courtId: court._id,
    });

    router.push(appRoutes.gameDetails, `/game/${game.slug}`);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const supportsDateAndTimePickers = checkDateInput();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Game info</h3>
          <p className="mt-1 text-sm leading-5 text-gray-600">
            Are you planning on playing 5v5? Full-court? Tell us here!
          </p>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <form onSubmit={handleSubmit}>
          <div className="shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputLabel htmlFor={NAME_NAME}>Name*</InputLabel>
                  <input
                    id={NAME_NAME}
                    name={NAME_NAME}
                    placeholder="Chill Full-Court 5v5"
                    required
                    value={gameName}
                    onChange={handleChange}
                    className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <InputLabel htmlFor={DATE_NAME}>Date*</InputLabel>
                  {
                    // TODO: ABSTRACT SOME OF THIS ANNOYING ASS LOGIC AWAY
                    // TODO: maybe make this for all desktops?
                    // The safari fallback changehandler works differently, so account for that
                  }
                  {supportsDateAndTimePickers ? (
                    <input
                      id={DATE_NAME}
                      name={DATE_NAME}
                      min={format(Date.now(), 'yyyy-MM-dd')}
                      required
                      type="date"
                      onChange={handleChange}
                      value={date || ''}
                      onBlur={handleChange}
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  ) : (
                    <DatePicker
                      selected={date || undefined}
                      onChange={handleChange}
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputLabel htmlFor={START_TIME_NAME}>Start time*</InputLabel>
                  {checkDateInput() ? (
                    <input
                      id={START_TIME_NAME}
                      name={START_TIME_NAME}
                      type="time"
                      required
                      value={startTime}
                      onChange={handleChange}
                      onBlur={handleChange}
                      className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    />
                  ) : (
                    'Does not support datetime'
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <InputLabel htmlFor={END_TIME_NAME}>End time*</InputLabel>
                  <input
                    id={END_TIME_NAME}
                    name={END_TIME_NAME}
                    min={startTime}
                    type="time"
                    required
                    value={endTime}
                    onChange={handleChange}
                    max="24:00"
                    className="mt-1 block form-select w-full py-2 px-3 py-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  />
                </div>
              </div>
              <div className="mt-6">
                <InputLabel htmlFor={DESCRIPTION_NAME} className="block text-sm leading-5 font-medium text-gray-700">
                  Description
                </InputLabel>
                <div className="rounded-md shadow-sm">
                  <textarea
                    id={DESCRIPTION_NAME}
                    name={DESCRIPTION_NAME}
                    rows={3}
                    value={description}
                    className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    placeholder="Add anything else hoopers might care about like 'This is an elementary school so only available after-school'"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <Button>Save</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameForm;
