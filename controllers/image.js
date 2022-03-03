const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 2f75dc1f2c2c45d9bd47bed164399c3f");

const handleApiCall = (req, res) => {
	stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "face-detection",
        version_id: "6dc7e46bc9124c5c8824be4822abe105",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
	    (err, response) => {
	        if (err) {
	            console.log("Error: " + err);
	            return;
	        }

	        if (response.status.code !== 10000) {
	            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
	            return;
	        }

	        console.log("Predicted concepts, with confidence values:")
	        for (const c of response.outputs[0].data.regions) {
	            console.log(response);
	        }
	        res.json(response)
	    }
	);
}

const handleImage = (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			res.json(user.entries);
		}
	})
	if (!found) {
		res.status(400).json('not found!');
	}
}

module.exports = { handleApiCall, handleImage }