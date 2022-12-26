import React from "react";
import Channel from "./Channel";
import { Button, Spinner } from "@blueprintjs/core";
const rows = ["Channel", "Category", "Status", "Vods", "Remove"];
const Channels = ({ channels, loading }) => {
  if (loading)
    return (
      <div className="flex items-center justify-center text-green-200">
        fetching...
      </div>
    );

  if (channels.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center text-green-200">
        No live channels available
      </div>
    );
  }

  return (
    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              {rows.map((row, i) => (
                <th
                  key={i}
                  className="px-5 py-3 border-b-2 border-gray-700 bg-gray-600 text-center text-xs font-semibold text-green-200 uppercase tracking-wider"
                >
                  {row}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {channels.map((channel, i) => (
              <Channel key={i} channel={channel} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Channels;
<div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
  <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
    <table class="min-w-full leading-normal">
      <thead>
        <tr>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            User
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Rol
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Created at
          </th>
          <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <div class="flex items-center">
              <div class="flex-shrink-0 w-10 h-10">
                <img
                  class="w-full h-full rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div>
              <div class="ml-3">
                <p class="text-gray-900 whitespace-no-wrap">Vera Carpenter</p>
              </div>
            </div>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">Admin</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p class="text-gray-900 whitespace-no-wrap">Jan 21, 2020</p>
          </td>
          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
              <span
                aria-hidden
                class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
              ></span>
              <span class="relative">Activo</span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>;
