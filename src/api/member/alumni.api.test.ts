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

  test("parses the exact confirmed live response shape from GET /api/alumni", async () => {
    mockedGet.mockResolvedValue({
      data: {
        status: "success",
        results: 2,
        data: {
          alumni: [
            {
              name: "Entue MUGABO",
              imageUrl: "https://example.com/entue.jpg",
              role: "Full-Stack Developer",
            },
            {
              name: "Olivier IRADUKUNDA",
              imageUrl: "https://example.com/olivier.jpg",
              role: "Cybersecurity Specialist",
            },
          ],
        },
      },
    });

    const result = await getAlumni();

    expect(result).toEqual([
      {
        name: "Entue MUGABO",
        imageUrl: "https://example.com/entue.jpg",
        role: "Full-Stack Developer",
      },
      {
        name: "Olivier IRADUKUNDA",
        imageUrl: "https://example.com/olivier.jpg",
        role: "Cybersecurity Specialist",
      },
    ]);
  });
});
