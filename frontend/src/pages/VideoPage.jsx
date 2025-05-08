// // export default function VideosPage() {
// //   return (
// //     <div className="flex items-center justify-center h-screen">
// //       <h1 className="text-3xl font-bold">🎥 Video library (Coming Soon)</h1>
// //     </div>
// //   );
// // }

// // pages/VideoPage.jsx
// // import { useEffect, useState } from "react";
// // import { getVideos, purchaseVideo } from "../utils/mock_apiservices";
// // //import axios from 'axios';

// // // import { getVideos, purchaseVideo } from "../utils/mock_apiservices";

// // export default function VideoPage() {
// //   const [videos, setVideos] = useState([]);

// //   useEffect(() => {
// //     getVideos().then(setVideos).catch(console.error);
// //   }, []);

// //   const handlePurchase = async (videoId) => {
// //     const user = { name: "Max Mustermann", email: "max@example.com" }; // Replace with actual auth/user context
// //     await purchaseVideo(videoId, user);
// //     alert("Video freigeschaltet!");
// //   };

// //   return (
// //     <div className="p-4">
// //       <h2 className="text-2xl font-bold mb-4">🎥 Verfügbare Videos</h2>
// //       {videos.map((video) => (
// //         <div key={video.id} className="border p-4 mb-4 rounded">
// //           <h3 className="font-semibold">{video.title}</h3>
// //           <p>{video.description}</p>
// //           <button
// //             onClick={() => handlePurchase(video.id)}
// //             className="mt-2 bg-purple-500 text-white px-4 py-2 rounded"
// //           >
// //             Freischalten (€)
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // pages/VideoPage.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";

// const VideoPage = () => {
//   const [webinars, setWebinars] = useState([]);
//   const [selectedWebinar, setSelectedWebinar] = useState(null);
//   const [formData, setFormData] = useState({ name: "", email: "" });

//   useEffect(() => {
//     axios
//       .get("/api/webinars")
//       .then((res) => setWebinars(res.data))
//       .catch((err) => console.error(err));
//   }, []);

//   const handleRegister = async () => {
//     if (!selectedWebinar) return;

//     try {
//       const res = await axios.post(
//         `/api/webinars/${selectedWebinar.id}/registrants`,
//         formData
//       );
//       alert("Registered successfully!");
//     } catch (error) {
//       alert("Registration failed");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Upcoming Webinars</h1>
//       <ul className="mt-4 space-y-2">
//         {webinars.map((webinar) => (
//           <li key={webinar.id} className="border p-2 rounded">
//             <h2 className="font-semibold">{webinar.topic}</h2>
//             <p>{new Date(webinar.date).toLocaleString()}</p>
//             <p>{webinar.description}</p>
//             <button
//               onClick={() => setSelectedWebinar(webinar)}
//               className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
//             >
//               Register
//             </button>
//           </li>
//         ))}
//       </ul>

//       {selectedWebinar && (
//         <div className="mt-6 border p-4 rounded bg-gray-50">
//           <h3 className="font-semibold mb-2">
//             Register for {selectedWebinar.topic}
//           </h3>
//           <input
//             type="text"
//             placeholder="Name"
//             className="block mb-2 p-2 border w-full"
//             value={formData.name}
//             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="block mb-2 p-2 border w-full"
//             value={formData.email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//           />
//           <button
//             onClick={handleRegister}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPage;
