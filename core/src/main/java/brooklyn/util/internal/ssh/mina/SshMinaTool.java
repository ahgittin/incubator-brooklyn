/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package brooklyn.util.internal.ssh.mina;

import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import brooklyn.util.internal.ssh.SshAbstractTool;

public class SshMinaTool extends SshAbstractTool {

    protected SshMinaTool(AbstractSshToolBuilder<?, ?> builder) {
        super(builder);
        // TODO Auto-generated constructor stub
    }

    @Override
    public void connect() {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void connect(int maxAttempts) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void disconnect() {
        // TODO Auto-generated method stub
        
    }

    @Override
    public boolean isConnected() {
        // TODO Auto-generated method stub
        return false;
    }

    @Override
    public int execScript(Map<String, ?> props, List<String> commands, Map<String, ?> env) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int execCommands(Map<String, ?> properties, List<String> commands, Map<String, ?> env) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int copyToServer(Map<String, ?> props, File localFile, String pathAndFileOnRemoteServer) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int copyToServer(Map<String, ?> props, InputStream contents, String pathAndFileOnRemoteServer) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int copyToServer(Map<String, ?> props, byte[] contents, String pathAndFileOnRemoteServer) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public int copyFromServer(Map<String, ?> props, String pathAndFileOnRemoteServer, File local) {
        // TODO Auto-generated method stub
        return 0;
    }

}
