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
package org.apache.brooklyn.core.relations;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import org.apache.brooklyn.api.objs.BrooklynObject;
import org.apache.brooklyn.core.objs.BrooklynObjectInternal.RelationSupportInternal;
import org.apache.brooklyn.util.collections.MutableMap;
import org.apache.brooklyn.util.collections.MutableSet;

import com.google.common.base.Supplier;
import com.google.common.collect.Multimap;
import com.google.common.collect.Multimaps;

import brooklyn.basic.relations.Relationship;

public class BasicRelationSupport<SourceType extends BrooklynObject> implements RelationSupportInternal<SourceType> {

    final SourceType source;
    final Runnable relationChangeCallback;

    // TODO for now, relationships are stored here (and persisted); ideally we'd look them up in catalog
    private Map<String,Relationship<? super SourceType,? extends BrooklynObject>> relationships = MutableMap.of();

    private Multimap<String,BrooklynObject> relations = Multimaps.newMultimap(MutableMap.<String,Collection<BrooklynObject>>of(), 
        new Supplier<Collection<BrooklynObject>>() {
            public Collection<BrooklynObject> get() {
                return MutableSet.of();
            }
        });

    public BasicRelationSupport(SourceType source, Runnable relationChangeCallback) { 
        this.source = source;
        this.relationChangeCallback = relationChangeCallback;
    }

    @Override
    public Set<Relationship<? super SourceType,? extends BrooklynObject>> getRelationships() {
        synchronized (relations) {
            return MutableSet.copyOf(relationships.values());
        }
    }

    @SuppressWarnings("unchecked") @Override 
    public <U extends BrooklynObject> Set<U> getRelations(Relationship<? super SourceType, U> relationship) {
        synchronized (relations) {
            return (Set<U>)MutableSet.copyOf(relations.get(relationship.getRelationshipTypeName()));
        }
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    public <U extends BrooklynObject> void add(Relationship<? super SourceType,? super U> relationship, U target) {
        synchronized (relations) {
            relationships.put(relationship.getRelationshipTypeName(), (Relationship)relationship);
            relations.put(relationship.getRelationshipTypeName(), target);
        }
        onRelationsChanged();
    }

    @Override
    public <U extends BrooklynObject> void remove(Relationship<? super SourceType,? super U> relationship, U target) {
        synchronized (relations) {
            relations.remove(relationship.getRelationshipTypeName(), target);
        }
        onRelationsChanged();
    }

    protected void onRelationsChanged() {
        if (relationChangeCallback!=null) relationChangeCallback.run();
    }

}
