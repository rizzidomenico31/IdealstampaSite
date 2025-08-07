export default function Contact() {
    return (
        <section className="text-gray-600 body-font relative mt-3">
            <div className="absolute inset-0 ">
                <iframe width="100%" height="100%" frameBorder="0" marginHeight="0" marginWidth="0" title="map"
                        scrolling="no"
                        src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=Tipografia%20Idealstampa,%20Turi;ie=UTF8&amp;t=&amp;z=16&amp;iwloc=B&amp;output=embed"
                        style={{ filter: " opacity(0.6)" }}></iframe>

            </div>
            <div className="container px-5 py-24 mx-auto flex">
                <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">

                    {/* Titolo */}
                    <h2 className="text-gray-900 text-lg mb-3 font-medium title-font">Contatti</h2>

                    {/* 📞 Info di contatto */}
                    <div className="mb-6 space-y-2 text-sm text-gray-700">
                        {/* WhatsApp */}
                        <div className="flex items-center space-x-2">
                            <span className="[&>svg]:h-5 [&>svg]:w-5">
  <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 448 512">

      <path
          d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
</span>
                            <a href="https://wa.me/391234567890" target="_blank" rel="noopener noreferrer"
                               className="hover:underline">
                                +39 377 080 2322
                            </a>
                            <p>(Solo Whatsapp)</p>
                        </div>

                        {/* Email */}
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                <path fillRule="evenodd" d="M2.106 6.447A2 2 0 0 0 1 8.237V16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.236a2 2 0 0 0-1.106-1.789l-7-3.5a2 2 0 0 0-1.788 0l-7 3.5Zm1.48 4.007a.75.75 0 0 0-.671 1.342l5.855 2.928a2.75 2.75 0 0 0 2.46 0l5.852-2.927a.75.75 0 1 0-.67-1.341l-5.853 2.926a1.25 1.25 0 0 1-1.118 0l-5.856-2.928Z" clipRule="evenodd" />
                            </svg>


                            <a href="mailto:info@tipografiaideal.it" className="hover:underline">
                                info@idealstampa.com
                            </a>
                        </div>
                    </div>

                    {/* ✉️ Form */}
                    <p className="leading-relaxed mb-5 text-gray-600">Inviaci un messaggio, ti risponderemo al più
                        presto.</p>

                    <div className="relative mb-4">
                        <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                    </div>

                    <div className="relative mb-4">
                        <label htmlFor="message" className="leading-7 text-sm text-gray-600">Messaggio</label>
                        <textarea
                            id="message"
                            name="message"
                            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        ></textarea>
                    </div>

                    <button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                        Invia
                    </button>

                    <p className="text-xs text-gray-500 mt-3">Ti ricontatteremo entro 24 ore lavorative.</p>
                </div>
            </div>

        </section>
    )
}