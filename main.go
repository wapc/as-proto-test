package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"

	"github.com/gogo/protobuf/proto"
	"github.com/wapc/wapc-go"

	pb "github.com/wapc/as-proto-test/proto"
)

func main() {
	ctx := context.Background()
	code, err := ioutil.ReadFile("testdata/hello.wasm")
	if err != nil {
		panic(err)
	}

	module, err := wapc.New(consoleLog, code, wapc.NoOpHostCallHandler)
	if err != nil {
		panic(err)
	}
	defer module.Close()

	instance, err := module.Instantiate()
	if err != nil {
		panic(err)
	}
	defer instance.Close()

	message := pb.Test{
		FieldUint64: 12345,
	}
	payload, err := proto.Marshal(&message)
	if err != nil {
		panic(err)
	}

	result, err := instance.Invoke(ctx, "protoEcho", payload)
	if err != nil {
		panic(err)
	}

	var response pb.Test
	err = proto.Unmarshal(result, &response)
	if err != nil {
		panic(err)
	}

	jsonBytes, err := json.MarshalIndent(&response, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(jsonBytes))
}

func consoleLog(msg string) {
	fmt.Println(msg)
}
