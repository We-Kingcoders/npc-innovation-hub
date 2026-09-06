jest.mock("../client", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import apiClient from "../client";
import { getAlumni } from "./alumni.api";

const mockedGet = apiClient.get as jest.Mock;

describe("getAlumni", () => {
  afterEach(() => jest.clearAllMocks());

  test("calls the public alumni route", async () => {
    mockedGet.mockResolvedValue({ data: { data: { alumni: [] } } });

    await getAlumni();

    expect(mockedGet).toHaveBeenCalledWith("/api/alumni");
  });

  test("reads each entry's name from fullName, not name", async () => {
    mockedGet.mockResolvedValue({
      data: {
        data: {
          alumni: [
            {
              fullName: "Grace Uwase",
              role: "UI/UX Designer",
              imageUrl: null,
            },
          ],
        },
      },
    });

    const result = await getAlumni();

    expect(result).toEqual([
      { name: "Grace Uwase", role: "UI/UX Designer", imageUrl: null },
    ]);
  });

  test("returns an empty array when the response has no alumni array", async () => {
    mockedGet.mockResolvedValue({ data: {} });

    const result = await getAlumni();

    expect(result).toEqual([]);
  });
});
