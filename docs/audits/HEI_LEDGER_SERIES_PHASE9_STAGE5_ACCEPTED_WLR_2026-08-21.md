# Stage 5 accepted relationship candidates — cryptocurrency-wallet-lifecycle-registry

Count: **161**

## product_of (149)

Inclusive product-ID ranges below are the complete `product_of` inventory. Every row is supported by `current_state.native.parent_entity.id`.

The range notation is audit-only compression and is **not** a Series record-identity syntax. A Stage 5 publication implementation must expand every product ID in these ranges into an individual relationship using the existing namespaced `global_record_key`: source `cryptocurrency-wallet-lifecycle-registry:wlr.product-record.v1:<wlr_prod_id>` and target `cryptocurrency-wallet-lifecycle-registry:wlr.wallet-record.v1:<wlr_ent_id>`. No range token is itself a record identity, and raw WLR IDs must not be published as cross-record targets without the registry and native-record-type namespace. The `predecessor_of` / `successor_of` rows below likewise expand product-to-product with `wlr.product-record.v1` on both sides.

```text
wlr_prod_000001..wlr_prod_000006 -> wlr_ent_000001
wlr_prod_000007..wlr_prod_000013 -> wlr_ent_000002
wlr_prod_000014..wlr_prod_000018 -> wlr_ent_000003
wlr_prod_000019..wlr_prod_000020 -> wlr_ent_000004
wlr_prod_000021..wlr_prod_000024 -> wlr_ent_000005
wlr_prod_000025..wlr_prod_000027 -> wlr_ent_000006
wlr_prod_000028..wlr_prod_000031 -> wlr_ent_000007
wlr_prod_000032..wlr_prod_000034 -> wlr_ent_000008
wlr_prod_000035..wlr_prod_000036 -> wlr_ent_000009
wlr_prod_000037 -> wlr_ent_000010
wlr_prod_000038..wlr_prod_000039 -> wlr_ent_000011
wlr_prod_000040 -> wlr_ent_000012
wlr_prod_000041 -> wlr_ent_000013
wlr_prod_000042..wlr_prod_000044, wlr_prod_000075 -> wlr_ent_000014
wlr_prod_000045..wlr_prod_000046 -> wlr_ent_000015
wlr_prod_000047..wlr_prod_000049 -> wlr_ent_000016
wlr_prod_000050..wlr_prod_000053 -> wlr_ent_000017
wlr_prod_000054..wlr_prod_000056 -> wlr_ent_000018
wlr_prod_000057..wlr_prod_000058 -> wlr_ent_000019
wlr_prod_000059..wlr_prod_000060 -> wlr_ent_000020
wlr_prod_000061 -> wlr_ent_000021
wlr_prod_000062 -> wlr_ent_000022
wlr_prod_000063..wlr_prod_000064 -> wlr_ent_000023
wlr_prod_000065..wlr_prod_000067 -> wlr_ent_000024
wlr_prod_000068..wlr_prod_000069 -> wlr_ent_000025
wlr_prod_000070..wlr_prod_000074 -> wlr_ent_000026
wlr_prod_000076 -> wlr_ent_000027
wlr_prod_000077 -> wlr_ent_000028
wlr_prod_000078 -> wlr_ent_000029
wlr_prod_000079 -> wlr_ent_000030
wlr_prod_000080 -> wlr_ent_000031
wlr_prod_000081 -> wlr_ent_000032
wlr_prod_000082 -> wlr_ent_000033
wlr_prod_000083 -> wlr_ent_000034
wlr_prod_000084 -> wlr_ent_000035
wlr_prod_000085 -> wlr_ent_000036
wlr_prod_000086 -> wlr_ent_000037
wlr_prod_000087 -> wlr_ent_000038
wlr_prod_000088 -> wlr_ent_000039
wlr_prod_000089 -> wlr_ent_000040
wlr_prod_000090 -> wlr_ent_000041
wlr_prod_000091 -> wlr_ent_000042
wlr_prod_000092 -> wlr_ent_000043
wlr_prod_000093 -> wlr_ent_000044
wlr_prod_000094 -> wlr_ent_000045
wlr_prod_000095 -> wlr_ent_000046
wlr_prod_000096 -> wlr_ent_000047
wlr_prod_000097 -> wlr_ent_000048
wlr_prod_000098 -> wlr_ent_000049
wlr_prod_000099 -> wlr_ent_000050
wlr_prod_000100 -> wlr_ent_000051
wlr_prod_000101 -> wlr_ent_000052
wlr_prod_000102 -> wlr_ent_000053
wlr_prod_000103 -> wlr_ent_000054
wlr_prod_000104 -> wlr_ent_000055
wlr_prod_000105 -> wlr_ent_000056
wlr_prod_000106 -> wlr_ent_000057
wlr_prod_000107 -> wlr_ent_000058
wlr_prod_000108 -> wlr_ent_000059
wlr_prod_000109 -> wlr_ent_000060
wlr_prod_000110 -> wlr_ent_000061
wlr_prod_000111 -> wlr_ent_000062
wlr_prod_000112 -> wlr_ent_000063
wlr_prod_000113 -> wlr_ent_000064
wlr_prod_000114 -> wlr_ent_000065
wlr_prod_000115 -> wlr_ent_000066
wlr_prod_000116 -> wlr_ent_000067
wlr_prod_000117 -> wlr_ent_000068
wlr_prod_000118 -> wlr_ent_000069
wlr_prod_000119 -> wlr_ent_000070
wlr_prod_000120 -> wlr_ent_000071
wlr_prod_000121 -> wlr_ent_000072
wlr_prod_000122 -> wlr_ent_000073
wlr_prod_000123 -> wlr_ent_000074
wlr_prod_000124 -> wlr_ent_000075
wlr_prod_000125 -> wlr_ent_000076
wlr_prod_000126 -> wlr_ent_000077
wlr_prod_000127 -> wlr_ent_000078
wlr_prod_000128 -> wlr_ent_000079
wlr_prod_000129 -> wlr_ent_000080
wlr_prod_000130 -> wlr_ent_000081
wlr_prod_000131 -> wlr_ent_000082
wlr_prod_000132 -> wlr_ent_000083
wlr_prod_000133 -> wlr_ent_000084
wlr_prod_000134 -> wlr_ent_000085
wlr_prod_000135 -> wlr_ent_000086
wlr_prod_000136 -> wlr_ent_000087
wlr_prod_000137 -> wlr_ent_000088
wlr_prod_000138 -> wlr_ent_000089
wlr_prod_000139 -> wlr_ent_000090
wlr_prod_000140 -> wlr_ent_000091
wlr_prod_000141 -> wlr_ent_000092
wlr_prod_000142 -> wlr_ent_000093
wlr_prod_000143 -> wlr_ent_000094
wlr_prod_000144 -> wlr_ent_000095
wlr_prod_000145 -> wlr_ent_000096
wlr_prod_000146 -> wlr_ent_000097
wlr_prod_000147 -> wlr_ent_000098
wlr_prod_000148 -> wlr_ent_000099
wlr_prod_000149 -> wlr_ent_000100
```

## predecessor_of (6)

```text
wlr_prod_000025 -> wlr_prod_000027 | current_state.native.successor_product_id=wlr_prod_000027
wlr_prod_000028 -> wlr_prod_000029 | current_state.native.successor_product_id=wlr_prod_000029
wlr_prod_000029 -> wlr_prod_000030 | current_state.native.successor_product_id=wlr_prod_000030
wlr_prod_000032 -> wlr_prod_000033 | current_state.native.successor_product_id=wlr_prod_000033
wlr_prod_000050 -> wlr_prod_000051 | current_state.native.successor_product_id=wlr_prod_000051
wlr_prod_000065 -> wlr_prod_000066 | current_state.native.successor_product_id=wlr_prod_000066
```

## successor_of (6)

```text
wlr_prod_000027 -> wlr_prod_000025 | current_state.native.predecessor_product_id=wlr_prod_000025
wlr_prod_000029 -> wlr_prod_000028 | current_state.native.predecessor_product_id=wlr_prod_000028
wlr_prod_000030 -> wlr_prod_000029 | current_state.native.predecessor_product_id=wlr_prod_000029
wlr_prod_000033 -> wlr_prod_000032 | current_state.native.predecessor_product_id=wlr_prod_000032
wlr_prod_000051 -> wlr_prod_000050 | current_state.native.predecessor_product_id=wlr_prod_000050
wlr_prod_000066 -> wlr_prod_000065 | current_state.native.predecessor_product_id=wlr_prod_000065
```
